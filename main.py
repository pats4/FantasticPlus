import pathlib
import subprocess
import asyncio
import os

HOME_DIR = str(pathlib.Path(os.getcwd()).parent.parent.resolve())
PARENT_DIR = str(pathlib.Path(__file__).parent.resolve())
BACKEND_PATH = str(pathlib.Path(PARENT_DIR) / "bin" / "backend")

LOG_LOCATION = "/tmp/fantasticplus.py.log"

import logging

logging.basicConfig(
    filename = LOG_LOCATION,
    format = '%(asctime)s %(levelname)s %(message)s',
    filemode = 'w',
    force = True)

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
logging.info("Fantastic+ (FantasticPlus) main.py, based on https://github.com/NGnius/Fantastic")


def _ensure_executable() -> None:
    """Decky installs plugins from a zip, and the exec bit may not survive that."""
    try:
        if os.path.isfile(BACKEND_PATH) and not os.access(BACKEND_PATH, os.X_OK):
            os.chmod(BACKEND_PATH, 0o755)
            logging.info("restored the executable bit on %s", BACKEND_PATH)
    except OSError as e:
        logging.warning("could not make %s executable: %s", BACKEND_PATH, e)


class Plugin:
    backend_proc = None
    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        # startup
        _ensure_executable()
        try:
            self.backend_proc = subprocess.Popen(
                [BACKEND_PATH],
                env = dict(os.environ))
            logging.info("back-end started, pid %s", self.backend_proc.pid)
        except OSError as e:
            logging.error("failed to start %s: %s", BACKEND_PATH, e)
            self.backend_proc = None
        while True:
            await asyncio.sleep(1)

    async def _unload(self):
        # shutdown
        if self.backend_proc is not None:
            self.backend_proc.terminate()
            try:
                self.backend_proc.wait(timeout=5) # 5 seconds timeout
            except subprocess.TimeoutExpired:
                self.backend_proc.kill()
            self.backend_proc = None
