import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Field,
  Focusable,
  ModalRoot,
  Navigation,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showModal,
  SliderField,
  staticClasses,
  TextField,
  ToggleField,
  useQuickAccessVisible,
} from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { FaFan } from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";

import * as backend from "./backend";
import { Floor, Point, DEFAULT_FLOOR, floorAt, sanitize, STARTER_CURVE } from "./curve";
import { CurveEditor } from "./editor";
import { TempHistory } from "./history";
import { loadActive, loadProfiles, newId, Profile, saveActive, saveProfiles, uniqueName } from "./profiles";

const REPO_URL = "https://github.com/pats4/FantasticPlus";
const UPSTREAM_URL = "https://git.ngram.ca/NG-SD-Plugins/Fantastic";

// ---------------------------------------------------------------------------
// A small shared store: modals are rendered outside the panel's React tree, so
// state they change (profiles, selection) and live readings go through here.

type Store = {
  profiles: Profile[];
  active: string | null;
  temperature: number | null;
  rpm: number | null;
  interpolate: boolean;
  floor: Floor;
};

const store: Store = {
  profiles: [],
  active: null,
  temperature: null,
  rpm: null,
  interpolate: true,
  floor: DEFAULT_FLOOR,
};
const listeners = new Set<() => void>();

function update(patch: Partial<Store>) {
  Object.assign(store, patch);
  if (patch.profiles) saveProfiles(store.profiles);
  if ("active" in patch) saveActive(store.active);
  listeners.forEach((fn) => fn());
}

function useStore(): Store {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return store;
}

// ---------------------------------------------------------------------------
// Back-end actions

/** Make the selected profile the back-end's curve. */
async function pushSelection(active: string | null): Promise<void> {
  const profile = store.profiles.find((p) => p.id === active) ?? store.profiles[0];
  if (profile) {
    await backend.setCurve(profile.curve);
    if (store.active !== profile.id) update({ active: profile.id });
  }
}

async function saveProfileCurve(id: string, curve: Point[]): Promise<void> {
  const clean = sanitize(curve);
  update({ profiles: store.profiles.map((p) => (p.id === id ? { ...p, curve: clean } : p)) });
  if (store.active === id) {
    await backend.setCurve(clean);
  }
}

// ---------------------------------------------------------------------------
// Modals

const EditorModal: VFC<{ profileId: string; closeModal?: () => void }> = ({ profileId, closeModal }) => {
  const s = useStore();
  const profile = s.profiles.find((p) => p.id === profileId);
  const [draft, setDraft] = useState<Point[]>(profile ? profile.curve : []);
  if (!profile) {
    return (
      <ModalRoot closeModal={closeModal}>
        <div>This profile no longer exists.</div>
      </ModalRoot>
    );
  }
  return (
    <ModalRoot closeModal={closeModal} bAllowFullSize={true}>
      <div className={staticClasses.Title} style={{ marginBottom: "8px" }}>
        {"Fan curve · " + profile.name}
      </div>
      <CurveEditor curve={profile.curve} interpolate={s.interpolate} temperature={s.temperature} floor={s.floor} onChange={setDraft} />
      <div style={{ fontSize: "12px", color: "#ff9d9d", margin: "6px 0" }}>
        The Steam Deck relies on its fan. Above 80 °C a minimum speed is always enforced, whatever the curve says.
      </div>
      <Focusable flow-children="row" style={{ display: "flex", gap: "8px" }}>
        <div style={{ flex: "1 1 0" }}>
          <ButtonItem layout="below" onClick={() => closeModal?.()}>
            Cancel
          </ButtonItem>
        </div>
        <div style={{ flex: "1 1 0" }}>
          <ButtonItem
            layout="below"
            onClick={async () => {
              try {
                await saveProfileCurve(profile.id, draft);
              } catch (e) {
                console.warn("[FantasticPlus] saving curve failed", e);
              }
              closeModal?.();
            }}
          >
            Save
          </ButtonItem>
        </div>
      </Focusable>
    </ModalRoot>
  );
};

const BUTTON = { flex: "1 1 0", minWidth: 0, padding: "6px 8px" };

const ProfilesModal: VFC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const s = useStore();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");

  const commitRename = (id: string) => {
    const name = uniqueName(nameDraft, s.profiles, id);
    update({ profiles: s.profiles.map((p) => (p.id === id ? { ...p, name } : p)) });
    setRenaming(null);
  };

  return (
    <ModalRoot closeModal={closeModal}>
      <div className={staticClasses.Title} style={{ marginBottom: "8px" }}>
        Profiles
      </div>
      <Focusable flow-children="column">
        {s.profiles.map((p) => (
          // name on its own full-width line; small buttons in a row under it (side by side,
          // the buttons squeezed the name until it wrapped one letter per line)
          <div key={p.id} style={{ marginBottom: "10px" }}>
            {renaming === p.id ? (
              <TextField label="Name" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
            ) : (
              <Field label={(s.active === p.id ? "● " : "○ ") + p.name} bottomSeparator="none">
                {p.curve.length + " points"}
              </Field>
            )}
            <Focusable flow-children="row" style={{ display: "flex", gap: "6px" }}>
              {renaming === p.id ? (
                <DialogButton style={BUTTON} onClick={() => commitRename(p.id)}>
                  Done
                </DialogButton>
              ) : (
                <DialogButton
                  style={BUTTON}
                  onClick={() => {
                    setNameDraft(p.name);
                    setRenaming(p.id);
                  }}
                >
                  Rename
                </DialogButton>
              )}
              <DialogButton style={BUTTON} onClick={() => showModal(<EditorModal profileId={p.id} />)}>
                Edit
              </DialogButton>
              <DialogButton
                style={BUTTON}
                disabled={s.profiles.length <= 1}
                onClick={() => {
                  if (s.profiles.length <= 1) return;
                  const remaining = s.profiles.filter((x) => x.id !== p.id);
                  const patch: Partial<Store> = { profiles: remaining };
                  if (s.active === p.id) patch.active = remaining[0].id;
                  update(patch);
                  if (patch.active) pushSelection(patch.active).catch((e) => console.warn(e));
                }}
              >
                Delete
              </DialogButton>
            </Focusable>
          </div>
        ))}
      </Focusable>
      <ButtonItem
        layout="below"
        onClick={() => {
          const base = s.profiles.find((p) => p.id === s.active);
          const created: Profile = {
            id: newId(),
            name: uniqueName("Custom " + (s.profiles.length + 1), s.profiles, null),
            curve: base ? base.curve.slice() : STARTER_CURVE.slice(),
          };
          update({ profiles: s.profiles.concat([created]) });
        }}
      >
        + New profile (copy of the selected one)
      </ButtonItem>
      <ButtonItem layout="below" onClick={() => closeModal?.()}>
        Close
      </ButtonItem>
    </ModalRoot>
  );
};

// ---------------------------------------------------------------------------
// Quick Access panel

var periodicHook: any = null;
var name: string = "";
var version: string = "";

const MODE_RATIOS = [null, null, 0.5, 0.75, 1.0];

const Content: VFC<{ serverAPI: ServerAPI }> = () => {
  const s = useStore();
  const [ready, setReady] = useState(false);
  const [enabled, setEnabledState] = useState(false);
  const [fixed, setFixed] = useState<number | null>(null);
  const [status, setStatus] = useState<backend.Status | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await backend.ensureReady();
      if (cancelled) return;
      name = await backend.getName();
      version = await backend.getVersion();
      const [en, fx, interp, curve] = await Promise.all([
        backend.getEnabled(),
        backend.getFixedSpeed(),
        backend.getInterpolate(),
        backend.getCurve(),
      ]);
      if (cancelled) return;
      const profiles = loadProfiles(curve);
      let active = loadActive();
      // an unknown id (including one saved by an older version) falls back to the first profile
      if (!profiles.some((p) => p.id === active)) active = profiles[0].id;
      update({ profiles, active, interpolate: interp });
      setEnabledState(en);
      setFixed(fx);
      // keep the back-end in step with the selected profile
      await pushSelection(active);
      setReady(true);
    })().catch((e) => console.error("[FantasticPlus] start-up failed", e));

    return () => {
      cancelled = true;
    };
  }, []);

  // The only poll: one small request every 2 s, and only while the Quick Access menu
  // is showing. The panel stays mounted when the menu closes, so watch visibility.
  const visible = useQuickAccessVisible();
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const poll = async () => {
      try {
        await backend.ensureReady();
        const st = await backend.getStatus();
        if (st && !cancelled) {
          setStatus(st);
          update({ floor: st.floor, temperature: st.temperature, rpm: st.rpm });
        }
      } catch (e) {
        console.warn("[FantasticPlus] status failed", e);
      }
    };
    poll();
    if (periodicHook != null) clearInterval(periodicHook);
    periodicHook = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(periodicHook);
      periodicHook = null;
    };
  }, [visible]);

  if (!ready) {
    return (
      <PanelSectionRow>
        <Field label="Loading...">If you can read this for long, the back-end did not start :(</Field>
      </PanelSectionRow>
    );
  }

  const modeIndex = !enabled ? 0 : fixed == null ? 1 : fixed >= 1 ? 4 : fixed >= 0.75 ? 3 : 2;

  const applyMode = async (index: number) => {
    try {
      const ratio = MODE_RATIOS[index];
      if (index === 1) await pushSelection(store.active);
      setFixed(await backend.setFixedSpeed(ratio));
      setEnabledState(await backend.setEnabled(index !== 0));
    } catch (e) {
      console.warn("[FantasticPlus] mode change failed", e);
    }
  };

  const select = async (id: string) => {
    try {
      update({ active: id });
      await pushSelection(id);
    } catch (e) {
      console.warn("[FantasticPlus] selecting profile failed", e);
    }
  };

  const onCard = (id: string) => {
    if (s.active !== id) {
      select(id);
    } else {
      showModal(<EditorModal profileId={id} />);
    }
  };

  const cards: { id: string; label: string }[] = s.profiles.map((p) => ({ id: p.id, label: p.name }));

  const rpm = s.rpm ?? 0;
  const percent =
    status && status.rpmMax > status.rpmMin ? Math.round(((rpm - status.rpmMin) / (status.rpmMax - status.rpmMin)) * 100) : null;
  const floorNow = s.temperature != null ? floorAt(s.temperature, s.floor) : 0;
  const lagging = enabled && status != null && !status.controlling && status.reason !== "";

  return (
    <PanelSection>
      <PanelSectionRow>
        <Field label="Current Fan Speed">
          {rpm.toFixed(0) + " RPM" + (rpm < 1 ? " (stopped)" : percent != null ? " (" + Math.max(0, percent) + "%)" : "")}
        </Field>
      </PanelSectionRow>
      <PanelSectionRow>
        <Field label="Current Temperature">{s.temperature != null ? s.temperature.toFixed(1) + " °C" : "—"}</Field>
      </PanelSectionRow>
      {status && <TempHistory history={status.history} fan={status.fanHistory} />}
      <PanelSectionRow>
        <SliderField
          label="Mode"
          value={modeIndex}
          min={0}
          max={4}
          step={1}
          notchCount={5}
          notchLabels={[
            { notchIndex: 0, label: "SteamOS" },
            { notchIndex: 1, label: "Profile" },
            { notchIndex: 2, label: "50%" },
            { notchIndex: 3, label: "75%" },
            { notchIndex: 4, label: "100%" },
          ]}
          notchTicksVisible={true}
          showValue={false}
          onChange={(v: number) => applyMode(v)}
        />
      </PanelSectionRow>
      {lagging && (
        <PanelSectionRow>
          <Field label="SteamOS has the fan">{status!.reason}</Field>
        </PanelSectionRow>
      )}
      {enabled && status?.controlling && floorNow > 0 && (status.targetRatio ?? 0) <= floorNow + 0.005 && (
        <PanelSectionRow>
          <Field label="Safety floor active">{"Held at " + Math.round(floorNow * 100) + "% or more"}</Field>
        </PanelSectionRow>
      )}
      <div className={staticClasses.PanelSectionTitle}>Profiles</div>
      <PanelSectionRow>
        <Focusable flow-children="column" style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
          {cards.map((card) => (
            <Focusable
              key={card.id}
              onActivate={() => onCard(card.id)}
              onClick={() => onCard(card.id)}
              style={{
                padding: "8px 10px",
                borderRadius: "4px",
                textAlign: "center",
                backgroundColor: s.active === card.id ? "rgba(26, 159, 255, 0.32)" : "rgba(255, 255, 255, 0.08)",
              }}
            >
              {card.label}
            </Focusable>
          ))}
          <div style={{ fontSize: "11px", opacity: 0.7 }}>
            Tap to select · tap the selected one again to edit or view. The Mode slider decides whether it runs.
          </div>
        </Focusable>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => showModal(<ProfilesModal />)}>
          Manage profiles
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Linear Interpolation"
          description="Straight lines between points (off: steps)"
          checked={s.interpolate}
          onChange={(value: boolean) => {
            backend.resolve(backend.setInterpolate(value), (v: boolean) => update({ interpolate: v }));
          }}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <Field label={name} onClick={() => Navigation.NavigateToExternalWeb(REPO_URL)}>
          {"v" + version}
        </Field>
      </PanelSectionRow>
      <PanelSectionRow>
        <Field label="Based on Fantastic" onClick={() => Navigation.NavigateToExternalWeb(UPSTREAM_URL)}>
          by NGnius
        </Field>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  let ico = <FaFan />;
  let now = new Date();
  if (now.getDate() == 1 && now.getMonth() == 3) {
    ico = <SiOnlyfans />;
  }

  return {
    title: <div className={staticClasses.Title}>FantasticPlus</div>,
    content: <Content serverAPI={serverApi} />,
    icon: ico,
    onDismount() {
      clearInterval(periodicHook!);
    },
  };
});
