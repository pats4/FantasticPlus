import pathlib
import subprocess
import asyncio
import os
import time

PARENT_DIR = str(pathlib.Path(__file__).parent.resolve())
BACKEND_PATH = os.path.join(PARENT_DIR, "bin", "backend")

LOG_LOCATION = "/tmp/fantasticplus.py.log"
VALVE_FAN_SERVICE = "jupiter-fan-control.service"
# Give up restarting after this many crashes in a row (the fan stays with SteamOS).
MAX_RESTARTS = 5

import logging

logging.basicConfig(
    filename = LOG_LOCATION,
    format = '%(asctime)s %(levelname)s %(message)s',
    filemode = 'w',
    force = True)

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
logging.info("FantasticPlus main.py, based on Fantastic by NGnius (https://git.ngram.ca/NG-SD-Plugins/Fantastic)")


def _ensure_executable() -> None:
    """Decky installs plugins from a zip, and the exec bit may not survive that."""
    try:
        if os.path.isfile(BACKEND_PATH) and not os.access(BACKEND_PATH, os.X_OK):
            os.chmod(BACKEND_PATH, 0o755)
            logging.info("restored the executable bit on %s", BACKEND_PATH)
    except OSError as e:
        logging.warning("could not make %s executable: %s", BACKEND_PATH, e)


def _restore_steamos_fan_control() -> None:
    """Used when the back-end died without handing the fan back (e.g. SIGKILL)."""
    try:
        subprocess.run(["systemctl", "start", VALVE_FAN_SERVICE], timeout=15, check=False)
        logging.info("started %s", VALVE_FAN_SERVICE)
    except Exception as e:
        logging.error("could not start %s: %s", VALVE_FAN_SERVICE, e)


class Plugin:
    backend_proc = None
    backend_started = 0.0
    stopping = False

    def _start_backend(self):
        _ensure_executable()
        try:
            self.backend_proc = subprocess.Popen([BACKEND_PATH], env = dict(os.environ))
            self.backend_started = time.monotonic()
            logging.info("back-end started, pid %s", self.backend_proc.pid)
        except OSError as e:
            logging.error("failed to start %s: %s", BACKEND_PATH, e)
            self.backend_proc = None

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        self.stopping = False
        crashes = 0
        self._start_backend()
        while not self.stopping:
            await asyncio.sleep(1)
            proc = self.backend_proc
            if proc is None or proc.poll() is None:
                continue
            if self.stopping:
                break
            # The back-end hands the fan back itself on a normal exit or panic, but not
            # when it is killed outright, so never leave SteamOS's controller stopped.
            logging.error("back-end exited unexpectedly with code %s", proc.returncode)
            _restore_steamos_fan_control()
            if time.monotonic() - self.backend_started > 300:
                crashes = 0  # a long healthy run before this crash
            crashes += 1
            if crashes > MAX_RESTARTS:
                logging.error("back-end crashed %d times; not restarting", crashes)
                self.backend_proc = None
                continue
            await asyncio.sleep(min(30, 2 ** crashes))
            if not self.stopping:
                self._start_backend()

    async def _unload(self):
        # shutdown
        self.stopping = True
        if self.backend_proc is not None:
            self.backend_proc.terminate()
            try:
                self.backend_proc.wait(timeout=5) # 5 seconds timeout
            except subprocess.TimeoutExpired:
                self.backend_proc.kill()
                _restore_steamos_fan_control()
            self.backend_proc = None
