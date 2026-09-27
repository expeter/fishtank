import { flushSync } from "react-dom";
import LanguageSwitch from "./LanguageSwitch";
import HelpGuide from "./HelpGuide";
import { fitDecoration } from "./sceneGeometry";
import { brushTerrain } from "./terrain";
import FoodIcon from "./FoodIcon";
import { WelcomeInstall } from "./WelcomeInstall";
import type { FoodKind } from "./feeding";
import { canPlaySpecies } from "./play";
import { ecologyEvent } from "./ecology";
import { worldEnvironment } from "./environment";
import Pip, { PipFace } from "./Pip";
import {
  isInstalled,
  toggleFullscreen,
  type InstallPromptEvent,
} from "./platform";
import { capturePhoto, canSharePhoto, downloadPhoto } from "./sharing";
import {
  captureLayout,
  restoreLayout,
  type LayoutSnapshot,
} from "./decorating";
import { fishColor } from "./appearance";
import { newBirths, type BirthNotice } from "./births";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Shovel,
  Eraser,
  BookOpen,
  Circle,
  Users,
  Pencil,
  Play,
  Wind,
  Move,
  Fish as FishIcon,
  Waves,
  Leaf,
  Coins,
  Volume2,
  VolumeX,
  Menu,
  X,
  Plus,
  ArrowLeft,
  Camera,
  Maximize,
  Download,
  Heart,
  ShoppingBag,
  Hand,
  Sparkles,
  Settings,
  Check,
  Lock,
  RotateCcw,
  FlipHorizontal,
  Layers,
  Trash2,
  Shell,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Clock,
  ChevronRight,
} from "lucide-react";
import Scene from "./Scene";
import Artwork from "./Artwork";
import {
  animals,
  canLiveIn,
  decorations,
  createSave,
  advance,
  breed,
  rescue,
  sell,
  capacity,
  progress,
  value,
  prices,
  tiers,
  buyFish,
  buyFood,
  FOOD_PRICES,
  uid,
  VERSION,
  type Decoration,
  type Save,
  type Lang,
  type Mode,
} from "./game";
import {
  loadSaves,
  persist,
  deleteSave,
  withSlotLock,
  SaveOwnershipError,
  getSlotPresence,
} from "./storage";
import { sound, tone, effect } from "./audio";
const FieldGuide = lazy(() => import("./FieldGuide"));
const isNewer = (remote: unknown, local: string) => {
  if (typeof remote !== "string" || !/^\d+\.\d+\.\d+$/.test(remote))
    return false;
  const a = remote.split(".").map(Number),
    b = local.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
};
const setting = (key: string, fallback: boolean) => {
  try {
    return JSON.parse(
      localStorage.getItem("ft-" + key) ?? String(fallback),
    ) as boolean;
  } catch {
    return fallback;
  }
};
const initialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("ft-language");
    return saved === "de" || saved === "en"
      ? saved
      : navigator.language.startsWith("de")
        ? "de"
        : "en";
  } catch {
    return "en";
  }
};
export default function App() {
  const [postcardMessage, setPostcardMessage] = useState("");
  const [postcardBusy, setPostcardBusy] = useState(false);
  const postcardSource = useRef<HTMLCanvasElement | null>(null);
  const postcardMeta = useRef({ worldName: "", timestamp: 0 });
  const [foodKind, setFoodKind] = useState<FoodKind>("flakes");
  const [guideSpecies, setGuideSpecies] = useState<string | null>(null);
  const [invitedFishId, setInvitedFishId] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState("draw");
  const [playGroup, setPlayGroup] = useState<string[]>([]);
  const [playCommand, setPlayCommand] = useState<{
    kind: "replay" | "circle" | "gather" | "bubbles";
    nonce: number;
  }>();
  const [lang, setLang] = useState<Lang>(initialLang),
    [slots, setSlots] = useState<(Save | null)[]>([null, null, null]),
    [save, setSave] = useState<Save | null>(null),
    [loaded, setLoaded] = useState(false),
    [pipOpen, setPipOpen] = useState(false),
    [blockedWorld, setBlockedWorld] = useState<{
      save: Save;
      lastActive: number | null;
    } | null>(null),
    [panel, setPanel] = useState(""),
    [tool, setTool] = useState("feed"),
    [toolOptions, setToolOptions] = useState(false),
    [fishId, setFishId] = useState<string | null>(null),
    [decorId, setDecorId] = useState<string | null>(null),
    [tab, setTab] = useState("animals"),
    [toast, setToast] = useState(""),
    [newSlot, setNewSlot] = useState<number | null>(null),
    [name, setName] = useState(""),
    [mode, setMode] = useState<Mode>("progression"),
    [muted, setMuted] = useState(() => setting("muted", true)),
    [music, setMusic] = useState(() => setting("music", true)),
    [effects, setEffects] = useState(() => setting("effects", true)),
    [reduced, setReduced] = useState(() =>
      setting(
        "reduced",
        matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
    ),
    [adult, setAdult] = useState(false),
    [undo, setUndo] = useState<LayoutSnapshot[]>([]),
    [confirm, setConfirm] = useState<null | {
      text: string;
      action: () => void;
    }>(null),
    [install, setInstall] = useState<InstallPromptEvent | null>(null),
    [update, setUpdate] = useState(false),
    [storageError, setStorageError] = useState(false),
    [birthNotices, setBirthNotices] = useState<BirthNotice[]>([]),
    [postcard, setPostcard] = useState<{ file: File; url: string } | null>(
      null,
    ),
    [takingPhoto, setTakingPhoto] = useState(false),
    [sharingPhoto, setSharingPhoto] = useState(false),
    [installed, setInstalled] = useState(isInstalled),
    [installing, setInstalling] = useState(false),
    [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));
  const canvas = useRef<HTMLCanvasElement>(null),
    current = useRef(save),
    release = useRef<(() => void) | null>(null),
    saveQueue = useRef(Promise.resolve()),
    alive = useRef(true);
  const previousBirthState = useRef<Save | null>(null);
  current.current = save;
  useEffect(() => {
    const previous = previousBirthState.current;
    previousBirthState.current = save;
    if (
      !save ||
      previous?.id !== save.id ||
      previous.created !== save.created
    ) {
      setBirthNotices([]);
      return;
    }
    const arrivals = newBirths(previous, save);
    if (arrivals.length) setBirthNotices((old) => [...old, ...arrivals]);
  }, [save]);
  useEffect(() => {
    document
      .querySelector<HTMLElement>(".panel-overlay .modal")
      ?.scrollTo(0, 0);
  }, [panel]);
  const t = (en: string, de: string) => (lang === "de" ? de : en);
  const notify = (en: string, de: string) => setToast(t(en, de));
  useEffect(() => {
    loadSaves()
      .then((s) => {
        setSlots(s);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
        setStorageError(true);
      });
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("ft-language", lang);
    } catch {}
  }, [lang]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(timer);
  }, [toast]);
  const write = (s: Save) => {
    const job = saveQueue.current.catch(() => {}).then(() => persist(s));
    saveQueue.current = job;
    job
      .then(() => {
        if (alive.current) {
          setStorageError(false);
          setSlots((old) => old.map((v, i) => (i === s.id ? s : v)));
        }
      })
      .catch((error) => {
        if (error instanceof SaveOwnershipError) {
          current.current = null;
          setSave(null);
          release.current?.();
          release.current = null;
          notify(
            "Your world is safe. You moved play to another window. Choose your world to play here again.",
            "Deine Welt ist sicher. Du spielst jetzt in einem anderen Fenster. Wähle deine Welt, um wieder hier zu spielen.",
          );
          void loadSaves()
            .then(setSlots)
            .catch(() => setStorageError(true));
        } else setStorageError(true);
      });
    return job;
  };
  useEffect(() => {
    if (!save) return;
    void write(save).catch(() => {});
  }, [save]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden)
        setSave((s) => (s ? rescue(breed(advance(s), Date.now())) : s));
    }, 1000);
    const autosave = setInterval(() => {
      if (current.current) void write(current.current).catch(() => {});
    }, 15000);
    const visibility = () => {
      if (current.current) {
        if (document.hidden) void write(current.current).catch(() => {});
        else setSave((s) => (s ? advance(s, Date.now(), true) : s));
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearInterval(timer);
      clearInterval(autosave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    let previousCheck = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const s = current.current;
      const event = s
        ? ecologyEvent(
            s.worlds[s.habitat].fish,
            !!s.predators,
            !document.hidden,
            now,
            previousCheck,
          )
        : null;
      previousCheck = now;
      if (!s) return;
      setSave((old) => {
        if (!old || old.id !== s.id) return old;
        const next = structuredClone(old);
        next.lastHuntAt = now;
        if (event)
          next.worlds[s.habitat].fish = next.worlds[s.habitat].fish.filter(
            (f) => f.id !== event.babyId,
          );
        return next;
      });
      if (event)
        notify(
          "A little food-chain moment: an adult caught an unnamed newborn.",
          "Ein Moment in der Nahrungskette: Ein erwachsenes Tier hat ein unbenanntes Jungtier gefressen.",
        );
    }, 60000);
    return () => clearInterval(timer);
  }, [save?.id]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "m" &&
        !e.repeat &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !(e.target as HTMLElement).isContentEditable &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        setMuted((v) => !v);
      if (e.key === "Escape") {
        setPanel("");
        setFishId(null);
        setTool("");
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    try {
      for (const [k, v] of Object.entries({ muted, music, effects, reduced }))
        localStorage.setItem("ft-" + k, JSON.stringify(v));
    } catch {}
  }, [muted, music, effects, reduced]);
  useEffect(() => {
    const sync = () => sound(!muted && !document.hidden, music);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [muted, music]);
  useEffect(() => {
    const unlock = () => {
      sound(!muted && !document.hidden, music);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [muted, music]);
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      if (
        !isInstalled() &&
        typeof (e as InstallPromptEvent).prompt === "function"
      )
        setInstall(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const check = async () => {
      try {
        const r = await fetch("/version.json", { cache: "no-store" }),
          data = await r.json();
        if (isNewer(data.version, VERSION)) {
          await navigator.serviceWorker
            ?.getRegistration()
            .then((r) => r?.update());
          setUpdate(true);
        }
      } catch {}
    };
    void check();
    const timer = setInterval(check, 900000);
    const foreground = () => {
      if (!document.hidden) void check();
    };
    document.addEventListener("visibilitychange", foreground);
    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeinstallprompt", handler);
      document.removeEventListener("visibilitychange", foreground);
    };
  }, []);
  const change = (fn: (s: Save) => void) =>
    setSave((s) => {
      if (!s) return s;
      const n = structuredClone(s);
      fn(n);
      return n;
    });
  const openSave = async (s: Save, takeover = false) => {
    await withSlotLock(
      s.id,
      async (lock) => {
        if (!lock) {
          const presence = await getSlotPresence(s.id);
          setBlockedWorld({ save: s, lastActive: presence.lastActive });
          return;
        }
        const fresh = (await loadSaves())[s.id] ?? s;
        setBlockedWorld(null);
        setPipOpen(false);
        setSave({ ...advance(fresh, Date.now(), true), tutorial: false });
        setToolOptions(false);
        setPanel("");
        setTool("feed");
        setNewSlot(null);
        await new Promise<void>((resolve) => {
          release.current = resolve;
        });
      },
      { takeover },
    ).catch(() => {
      setStorageError(true);
      notify(
        "Could not open this world. Its saved data has been preserved.",
        "Diese Welt konnte nicht geöffnet werden. Ihre Daten bleiben erhalten.",
      );
    });
  };
  const home = async () => {
    try {
      if (current.current) await write(current.current);
      release.current?.();
      release.current = null;
      setSave(null);
      setPanel("");
      setFishId(null);
      setTool("");
    } catch {
      notify(
        "Could not save. Please try again.",
        "Speichern fehlgeschlagen. Bitte erneut versuchen.",
      );
    }
  };
  const world = save?.worlds[save.habitat],
    fish = world?.fish.find((f) => f.id === fishId),
    selected = world?.decor.find((d) => d.id === decorId);
  const focusedFish = world?.fish.find((f) => f.id === playGroup[0]);
  const focusFish = (id: string) => {
    setToolOptions(false);
    setPipOpen(false);
    setFishId(id);
    setPanel("");
    if (playGroup[0] !== id) {
      setPlayCommand(undefined);
      setPlayMode("draw");
    }
    const f = world?.fish.find((f) => f.id === id);
    setPlayGroup(f && canPlaySpecies(f) ? [id] : []);
    if (f && canPlaySpecies(f)) setTool("play");
  };
  useEffect(() => {
    if (fishId && fish && canPlaySpecies(fish)) {
      if (playGroup[0] !== fishId) {
        setPlayCommand(undefined);
        setPlayMode("draw");
      }
      setPlayGroup([fishId]);
    }
  }, [fishId]);
  useEffect(() => {
    if (playGroup.length && !world?.fish.some((f) => f.id === playGroup[0])) {
      setPlayGroup([]);
      setPlayCommand(undefined);
    }
  }, [save?.id, save?.habitat, world?.fish.length]);
  const games = [
    { kind: "draw", icon: <Pencil />, en: "Draw a trail", de: "Spur zeichnen" },
    {
      kind: "replay",
      icon: <Play />,
      en: "Replay learned trails",
      de: "Gelernte Spur wiederholen",
    },
    { kind: "circle", icon: <Circle />, en: "Circle dance", de: "Kreistanz" },
    {
      kind: "gather",
      icon: <Users />,
      en: "Gather friends",
      de: "Komm zu mir",
    },
    { kind: "bubbles", icon: <Wind />, en: "Bubble game", de: "Blasenspiel" },
  ];
  const startGame = (kind: string, id = focusedFish?.id) => {
    const f = world?.fish.find((f) => f.id === id);
    if (!f || !canPlaySpecies(f)) return;
    if (kind === "replay" && !f.trick) return;
    setPlayGroup([f.id]);
    setTool("play");
    setPanel("");
    setFishId(null);
    setPlayMode(kind);
    setToolOptions(false);
    setPlayCommand(
      kind === "draw"
        ? undefined
        : {
            kind: kind as "replay" | "circle" | "gather" | "bubbles",
            nonce: Date.now(),
          },
    );
    if (effects) effect(kind === "bubbles" ? "bubble" : "play");
  };
  const gameButtons = (f: NonNullable<typeof fish>) => (
    <div className="fish-game-buttons">
      {games.map((a) => (
        <button
          key={a.kind}
          aria-label={t(a.en, a.de)}
          title={t(a.en, a.de)}
          disabled={a.kind === "replay" && !f.trick}
          aria-pressed={playMode === a.kind && playGroup[0] === f.id}
          onClick={() => startGame(a.kind, f.id)}
        >
          {a.icon}
          <span>
            {a.kind === "replay" ? t("Replay", "Wiederholen") : t(a.en, a.de)}
          </span>
        </button>
      ))}
    </div>
  );
  const birthNotice = birthNotices.find((n) =>
    save?.worlds[n.habitat].fish.some((f) => f.id === n.id),
  );
  const nextUnlock = tiers.find((threshold) => threshold > (save?.earned ?? 0));
  const unlocked = (tier: number) =>
    save?.mode === "creative" || (save?.earned ?? 0) >= tiers[tier];
  const buyAnimal = (id: string) => {
    if (!save || !world) return;
    const a = animals.find((a) => a.id === id)!;
    if (world.fish.length >= capacity(save)) {
      notify(
        "All 24 animal spots are filled. Sell an animal to make room.",
        "Alle 24 Tierplätze sind belegt. Verkaufe ein Tier für mehr Platz.",
      );
      return;
    }
    if (
      !unlocked(a.tier) ||
      (save.mode === "progression" && save.coins < prices[a.tier])
    )
      return;
    setSave((s) => (s ? buyFish(s, id, adult) : s));
    if (effects) effect("buy");
    notify("A new friend has moved in!", "Ein neuer Freund ist eingezogen!");
  };
  const recordLayout = () => {
    if (!save) return;
    const snapshot = captureLayout(save);
    setUndo((old) => [
      ...(["decorate", "sand-add", "sand-remove"].includes(tool)
        ? old
        : []
      ).slice(-49),
      snapshot,
    ]);
  };
  const undoLayout = () => {
    const snapshot = undo.at(-1);
    if (!snapshot) return;
    setSave((s) => (s ? restoreLayout(s, snapshot) : s));
    setUndo((old) => old.slice(0, -1));
    setDecorId(null);
  };
  const fitEditedDecor = (d: Decoration) => {
    const scene = canvas.current,
      viewport = scene?.parentElement;
    if (scene && viewport)
      Object.assign(
        d,
        fitDecoration(
          d,
          scene.clientWidth,
          scene.clientHeight,
          viewport.scrollLeft,
          viewport.clientWidth,
        ),
      );
  };
  const placeDecor = (
    id: string,
    fromInventory = false,
    template?: Decoration,
  ) => {
    if (!save || !world) return;
    if (world.decor.length >= 150) {
      notify(
        "All 150 decoration spots are filled.",
        "Alle 150 Dekoplätze sind belegt.",
      );
      return;
    }
    const d = decorations.find((d) => d.id === id)!;
    if (
      !fromInventory &&
      (!unlocked(d.tier) ||
        (save.mode === "progression" && save.coins < d.price))
    )
      return;
    recordLayout();
    const newId = uid();
    if (effects) effect("place");
    const scene = canvas.current;
    const viewport = scene?.parentElement;
    const placementX =
      scene && viewport
        ? (viewport.scrollLeft + viewport.clientWidth / 2) / scene.clientWidth
        : 0.5;
    change((s) => {
      if (s.worlds[s.habitat].decor.length >= 150) return;
      if (fromInventory && !s.inventory.includes(id)) return;
      if (
        !fromInventory &&
        s.mode === "progression" &&
        (s.coins < d.price || s.earned < tiers[d.tier])
      )
        return;
      if (fromInventory) s.inventory.splice(s.inventory.indexOf(id), 1);
      else if (s.mode === "progression") s.coins -= d.price;
      s.story ??= { fed: false, planted: false, hidden: false };
      s.story.planted = true;
      s.worlds[s.habitat].decor.push({
        id: newId,
        kind: id,
        x: Math.max(0.05, Math.min(0.95, placementX)),
        y: template?.y ?? 0.87,
        scale: template?.scale ?? 1,
        rotation: template?.rotation ?? 0,
        flip: template?.flip ?? false,
        layer: Date.now(),
      });
    });
    setDecorId(newId);
    setTool("decorate");
    setPanel("");
  };
  useEffect(() => {
    setPlayGroup([]);
    setInvitedFishId(null);
    setPlayCommand(undefined);
  }, [save?.id, save?.habitat]);
  const learn = (points: { x: number; y: number }[], ids: string[]) => {
    if (!ids.length) {
      notify(
        "Try a trail near a playful friend. Some prefer watching!",
        "Zeichne nah bei einem verspielten Freund. Manche schauen lieber zu!",
      );
      return;
    }
    const firstLesson = !save?.playGift;
    change((s) => {
      if (!s.playGift) {
        s.playGift = true;
        s.inventory.push(s.habitat === "sea" ? "d30" : "d25");
      }
      for (const f of s.worlds[s.habitat].fish)
        if (ids.includes(f.id)) {
          f.trick = {
            points: points.slice(0, 96),
            learnedAt: Date.now(),
            rehearsals: (f.trick?.rehearsals ?? 0) + 1,
          };
          f.mood = Math.min(100, f.mood + 12);
          f.careUntil = Date.now() + 180000;
        }
    });
    if (effects) effect("learn");
    notify(
      `${ids.length === 1 ? "One friend learned" : `${ids.length} friends learned`} your trail! ${firstLesson ? "A surprise toy is waiting in your collection!" : "They’ll practise, and remember it for Replay."}`,
      `${ids.length === 1 ? "Ein Freund hat" : `${ids.length} Freunde haben`} deine Spur gelernt! ${firstLesson ? "Ein Überraschungsspielzeug wartet in deiner Sammlung!" : "Sie üben sie und merken sie sich zum Wiederholen."}`,
    );
  };
  const care = () => {
    if (tool === "play")
      change((s) => {
        for (const f of s.worlds[s.habitat].fish) {
          if (
            playGroup.includes(f.id) &&
            f.playful > 0.45 &&
            Math.random() < 0.55
          ) {
            f.careUntil = Date.now() + 120000;
            f.mood = Math.min(100, f.mood + 8);
          }
        }
      });
    if (effects) effect(tool === "feed" ? "feed" : "play");
  };
  const purchaseFood = () => {
    let accepted = false;
    flushSync(() =>
      setSave((s) => {
        if (!s) return s;
        const next = buyFood(s, foodKind);
        accepted = s.mode === "creative" || next !== s;
        return next;
      }),
    );
    if (!accepted)
      setToast(
        t(
          "Not enough coins. Pocket money: 5 each minute of play.",
          "Nicht genug Münzen. Taschengeld: 5 pro Spielminute.",
        ),
      );
    return accepted;
  };
  const clean = (kind: "glass" | "litter", indices: number[]) =>
    change((s) => {
      const world = s.worlds[s.habitat];
      world.cleanup ??= { glass: Array(16).fill(0), litter: Array(16).fill(0) };
      for (const i of indices)
        if (Number.isInteger(i) && i >= 0 && i < 16)
          world.cleanup[kind][i] = Date.now();
    });
  const eaten = (id: string) =>
    change((s) => {
      const f = s.worlds[s.habitat].fish.find((f) => f.id === id);
      if (!f) return;
      f.lastFedAt = Date.now();
      f.hunger = Math.max(0, f.hunger - 24);
      f.mood = Math.min(100, f.mood + 7);
      f.careUntil = Date.now() + 120000;
      s.story ??= { fed: false, planted: false, hidden: false };
      s.story.fed = true;
    });
  useEffect(() => {
    return () => {
      if (postcard) URL.revokeObjectURL(postcard.url);
    };
  }, [postcard]);
  const photo = async () => {
    const target = canvas.current;
    if (!target || takingPhoto) return;
    setTakingPhoto(true);
    setPanel("");
    setDecorId(null);
    try {
      // Allow the selection outline to disappear before capturing the canvas.
      await new Promise((resolve) => setTimeout(resolve, 100));
      const frozen = document.createElement("canvas");
      frozen.width = target.width;
      frozen.height = target.height;
      frozen.getContext("2d")!.drawImage(target, 0, 0);
      postcardSource.current = frozen;
      postcardMeta.current = {
        worldName: save?.name ?? "Little Fishtank",
        timestamp: Date.now(),
      };
      const file = await capturePhoto(frozen, {
        ...postcardMeta.current,
        message: postcardMessage,
        lang,
      });
      setPostcard({ file, url: URL.createObjectURL(file) });
    } catch {
      notify(
        "Could not prepare the photo. Please try again.",
        "Das Foto konnte nicht erstellt werden. Bitte versuche es erneut.",
      );
    } finally {
      setTakingPhoto(false);
    }
  };
  useEffect(() => {
    if (!postcard || !postcardSource.current) return;
    let cancelled = false;
    setPostcardBusy(true);
    const timer = setTimeout(() => {
      void capturePhoto(postcardSource.current!, {
        ...postcardMeta.current,
        message: postcardMessage,
        lang,
      })
        .then((file) => {
          if (!cancelled) {
            setPostcard({ file, url: URL.createObjectURL(file) });
            setPostcardBusy(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setPostcardBusy(false);
            notify(
              "Could not update the postcard. Try again.",
              "Die Postkarte konnte nicht aktualisiert werden. Bitte erneut versuchen.",
            );
          }
        });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [postcardMessage, !!postcard, lang]);
  const sharePostcard = async () => {
    if (!postcard || sharingPhoto || postcardBusy) return;
    try {
      // Invoke sharing directly in this click handler, before any await.
      const shared = navigator.share({
        files: [postcard.file],
        title: postcardMeta.current.worldName,
        text: postcardMessage,
      });
      setSharingPhoto(true);
      await shared;
      setPostcard(null);
      notify(
        "Your postcard has been shared!",
        "Deine Postkarte wurde geteilt!",
      );
    } catch (error) {
      if ((error as Error).name !== "AbortError")
        notify(
          "Sharing is unavailable. You can save the image instead.",
          "Teilen ist gerade nicht möglich. Du kannst das Bild stattdessen speichern.",
        );
    } finally {
      setSharingPhoto(false);
    }
  };
  useEffect(() => {
    const onInstalled = () => {
      setInstalled(true);
      setInstall(null);
    };
    const media = matchMedia("(display-mode: standalone)");
    const onDisplay = () => setInstalled(isInstalled());
    const onFullscreen = () =>
      setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener("appinstalled", onInstalled);
    media.addEventListener("change", onDisplay);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("appinstalled", onInstalled);
      media.removeEventListener("change", onDisplay);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, []);
  const requestInstallation = async () => {
    const prompt = install;
    if (!prompt || installing || installed) return;
    setInstall(null);
    setInstalling(true);
    try {
      const result = await prompt.prompt();
      const choice = result ?? (await prompt.userChoice);
      if (choice?.outcome === "accepted")
        notify(
          "Your browser is finishing the installation.",
          "Dein Browser schließt die Installation ab.",
        );
    } catch {
      notify(
        "Use your browser menu to add this game to your home screen.",
        "Füge das Spiel über das Browsermenü zu deinem Startbildschirm hinzu.",
      );
    } finally {
      setInstalling(false);
    }
  };
  const changeFullscreen = async () => {
    try {
      if ((await toggleFullscreen()) === "unavailable")
        notify(
          "Fullscreen is not available here. You can still play, or install the app from the menu.",
          "Vollbild ist hier nicht verfügbar. Du kannst weiterspielen oder die App über das Menü installieren.",
        );
    } catch {
      notify(
        "Could not change fullscreen. You can keep playing here.",
        "Vollbild konnte nicht geändert werden. Du kannst hier weiterspielen.",
      );
    }
  };
  const activateUpdate = async () => {
    try {
      if (save) await write(save);
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg?.waiting) {
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => location.reload(),
          { once: true },
        );
        reg.waiting.postMessage("ACTIVATE");
      } else {
        // New workers can already be active; navigation fetches a fresh shell.
        try {
          await reg?.update();
        } catch {
          notify(
            "The update needs an internet connection. Please try again when online.",
            "Für das Update brauchst du eine Internetverbindung. Versuche es erneut, wenn du online bist.",
          );
          return;
        }
        location.reload();
      }
    } catch {
      setStorageError(true);
    }
  };
  const btn = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    cls = "",
  ) => (
    <button className={cls} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
  return (
    <div
      className={
        "app " + (save ? "playing" : "landing") + (reduced ? " reduced" : "")
      }
      onClickCapture={(e) => {
        if (effects && (e.target as HTMLElement).closest("button"))
          tone(360, 0.04, 0.015);
      }}
    >
      <header className="header">
        <button className="brand" onClick={() => (save ? void home() : null)}>
          <span className="brand-icon">
            <FishIcon size={25} />
          </span>
          <span>
            little fishtank<span className="brand-dot">.</span>
            <small>
              {t("A LITTLE WORLD OF WONDER", "EINE KLEINE WELT VOLLER WUNDER")}
            </small>
          </span>
        </button>
        <div className="header-right">
          {update && (
            <button
              className="update-chip"
              onClick={() => void activateUpdate()}
            >
              <Download size={14} />
              {t("Update ready", "Update bereit")}
            </button>
          )}
          <span className="cozy">
            <span />{" "}
            {t(
              "A little slower. A little happier.",
              "Etwas ruhiger. Etwas glücklicher.",
            )}
          </span>
          <button
            className="icon-button"
            aria-label={t("Toggle sound (M)", "Ton umschalten (M)")}
            aria-pressed={!muted}
            title="M"
            onClick={() => setMuted((v) => !v)}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            className="icon-button"
            aria-label={t("Menu", "Menü")}
            onClick={() => setPanel("menu")}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      {!save && (
        <div className="landing-language">
          <small>v{VERSION}</small>
          <LanguageSwitch lang={lang} onChange={setLang} />
        </div>
      )}
      {!save && (
        <WelcomeInstall
          lang={lang}
          installed={installed}
          available={!!install}
          onInstall={() =>
            install ? void requestInstallation() : setPanel("install")
          }
        />
      )}
      {blockedWorld && !save && (
        <aside className="world-recovery" role="status">
          <PipFace />
          <div>
            <strong>{t("Your world is safe", "Deine Welt ist sicher")}</strong>
            <p>
              {t(
                `“${blockedWorld.save.name}” is open in another tab or app window on this device.`,
                `„${blockedWorld.save.name}“ ist in einem anderen Tab oder App-Fenster auf diesem Gerät geöffnet.`,
              )}
            </p>
            <small>
              {blockedWorld.lastActive
                ? t(
                    `Last active ${Math.max(0, Math.floor((Date.now() - blockedWorld.lastActive) / 1000))} seconds ago.`,
                    `Zuletzt vor ${Math.max(0, Math.floor((Date.now() - blockedWorld.lastActive) / 1000))} Sekunden aktiv.`,
                  )
                : t(
                    "It may be a window you closed earlier.",
                    "Vielleicht ist es ein schon geschlossenes Fenster.",
                  )}
            </small>
            <p>
              {t(
                "Play here moves your world to this window and pauses saving in the other one.",
                "Hier spielen holt deine Welt in dieses Fenster. Das andere Fenster speichert dann nicht mehr.",
              )}
            </p>
            <div>
              <button
                className="primary"
                onClick={() => void openSave(blockedWorld.save, true)}
              >
                {t("Play here", "Hier spielen")}
              </button>
              <button onClick={() => setBlockedWorld(null)}>
                {t("Not now", "Nicht jetzt")}
              </button>
            </div>
          </div>
        </aside>
      )}
      {!save ? (
        <main className="home">
          <div className="eyebrow">
            <Sparkles size={15} />
            {t(
              "SMALL FISH. BIG POSSIBILITIES.",
              "KLEINE FISCHE. GROSSE MÖGLICHKEITEN.",
            )}
          </div>
          <h1>
            {t("A little world,", "Eine kleine Welt,")}
            <br />
            <em>{t("all yours.", "ganz für dich.")}</em>
          </h1>
          <p className="intro">
            {t(
              "Grow a few fins. Plant a little joy. Make an underwater home that feels like you.",
              "Lass Flossen wachsen. Pflanze ein bisschen Freude. Gestalte dein eigenes Zuhause unter Wasser.",
            )}
          </p>
          <div className="save-grid">
            {slots.map((s, i) => (
              <article className={"save-card " + (!s ? "empty" : "")} key={i}>
                <div
                  className={
                    "save-preview preview-" + i + (s ? " has-world" : "")
                  }
                >
                  {s && (
                    <div className="saved-art">
                      <Artwork world={s.worlds[s.habitat]} />
                    </div>
                  )}
                  <div className="preview-bubbles">
                    ○<br />◦
                  </div>
                  <FishIcon
                    className="preview-fish"
                    size={90}
                    strokeWidth={1.2}
                  />
                  <Leaf className="preview-leaf" size={105} strokeWidth={1} />
                  <span className="slot-tag">
                    {t("WORLD", "WELT")} 0{i + 1}
                  </span>
                  {s && (
                    <span className="mode-tag">
                      {s.mode === "creative"
                        ? t("Creative", "Kreativ")
                        : t("Growing", "Wächst")}
                    </span>
                  )}
                </div>
                <div className="save-info">
                  <h2>
                    {s
                      ? s.name
                      : t(
                          [
                            "Your first little world",
                            "Room for imagination",
                            "Another adventure",
                          ][i],
                          [
                            "Deine erste kleine Welt",
                            "Platz für Fantasie",
                            "Ein neues Abenteuer",
                          ][i],
                        )}
                  </h2>
                  <p className="slot-size">
                    {t(
                      ["Small world", "Medium world", "Huge world"][i],
                      ["Kleine Welt", "Mittlere Welt", "Riesige Welt"][i],
                    )}{" "}
                    · {t("24 animals per habitat", "24 Tiere je Wasserwelt")}
                  </p>
                  <p>
                    {s
                      ? t(
                          `${Object.values(s.worlds).reduce((n, w) => n + w.fish.length, 0)} little friends · Two habitats`,
                          `${Object.values(s.worlds).reduce((n, w) => n + w.fish.length, 0)} kleine Freunde · Zwei Wasserwelten`,
                        )
                      : t(
                          "An empty canvas, a sea of possibilities.",
                          "Ein leerer Platz voller Möglichkeiten.",
                        )}
                  </p>
                  <button
                    className={s ? "primary" : "outline"}
                    disabled={!loaded || storageError}
                    onClick={() =>
                      s
                        ? void openSave(s)
                        : (setNewSlot(i), setName(""), setMode("progression"))
                    }
                  >
                    {s
                      ? t("Come on in", "Komm herein")
                      : t("Create a world", "Welt erstellen")}
                    {s ? <ChevronRight size={18} /> : <Plus size={18} />}
                  </button>
                  {s && (
                    <button
                      className="delete-slot"
                      aria-label={t("Delete world", "Welt löschen")}
                      onClick={() =>
                        setConfirm({
                          text: t(
                            `Delete “${s.name}” forever?`,
                            `„${s.name}“ endgültig löschen?`,
                          ),
                          action: () => {
                            void withSlotLock(i, async (lock) => {
                              if (!lock) {
                                notify(
                                  "Close this world in other tabs first.",
                                  "Schließe diese Welt zuerst in anderen Tabs.",
                                );
                                return;
                              }
                              await deleteSave(i);
                              setSlots((old) =>
                                old.map((v, j) => (i === j ? null : v)),
                              );
                            }).catch(() => setStorageError(true));
                          },
                        })
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="local-note">
            <Leaf size={15} />
            {t(
              "No rush. No wrong turns. Your worlds are saved in this browser.",
              "Keine Eile. Kein Richtig oder Falsch. Deine Welten bleiben in diesem Browser.",
            )}
          </p>
        </main>
      ) : (
        <main className="game" aria-label={save.name}>
          <div className="world-heading">
            <div>
              <button className="breadcrumb" onClick={() => void home()}>
                <ArrowLeft size={13} />
                {t("My worlds", "Meine Welten")}
              </button>
              <h1 title={save.name}>
                {save.name}
                <span>
                  {save.mode === "creative"
                    ? t("CREATIVE", "KREATIV")
                    : t("YOUR HAPPY LITTLE PLACE", "DEIN KLEINER GLÜCKSORT")}
                </span>
              </h1>
            </div>
            <div className="world-stats">
              <button
                className="friends"
                aria-label={t("Meet all animals", "Alle Tiere ansehen")}
                onClick={() => setPanel("residents")}
              >
                <FishIcon size={19} />
                {world!.fish.length}
                <small>/ {capacity(save)}</small>
              </button>
              {save.mode === "progression" ? (
                <div
                  className="coin-pill"
                  aria-label={t("Wallet", "Geldbeutel")}
                  aria-live="polite"
                >
                  <Coins size={20} />
                  {save.coins >= 10000
                    ? new Intl.NumberFormat(lang, {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(save.coins)
                    : save.coins}
                  <span>{t("coins", "Münzen")}</span>
                </div>
              ) : (
                <div className="coin-pill">
                  <Sparkles size={18} />
                  {t("Free", "Gratis")}
                </div>
              )}
            </div>
          </div>
          <div className="habitat-tabs">
            <button
              aria-pressed={save.habitat === "aquarium"}
              aria-label={t("Aquarium", "Aquarium")}
              title={t("Aquarium", "Aquarium")}
              className={save.habitat === "aquarium" ? "active" : ""}
              onClick={() => {
                change((s) => (s.habitat = "aquarium"));
                setUndo([]);
                setFishId(null);
                setDecorId(null);
              }}
            >
              <FishIcon size={17} />
              <span>{t("Aquarium", "Aquarium")}</span>
            </button>
            <button
              aria-pressed={save.habitat === "sea"}
              aria-label={t("Woodland coast", "Waldküste")}
              title={t("Woodland coast", "Waldküste")}
              className={save.habitat === "sea" ? "active" : ""}
              onClick={() => {
                change((s) => (s.habitat = "sea"));
                setUndo([]);
                setFishId(null);
                setDecorId(null);
              }}
            >
              <Waves size={19} />
              <span>{t("Woodland coast", "Waldküste")}</span>
            </button>
            <span>
              <span className="live-dot" />
              {t("Life at its own pace", "Leben im eigenen Tempo")}
            </span>
          </div>
          <span
            className="weather-badge"
            aria-label={t("World weather and time", "Wetter und Weltzeit")}
          >
            {(() => {
              const e = worldEnvironment(save.created, Date.now());
              const WeatherIcon =
                save.habitat === "aquarium"
                  ? Clock
                  : e.daylight < 0.25
                    ? Moon
                    : e.weather === "rain"
                      ? CloudRain
                      : e.weather === "cloudy"
                        ? Cloud
                        : Sun;
              return (
                <>
                  <WeatherIcon size={12} />
                  <span>{`${String(Math.floor(e.hour)).padStart(2, "0")}:${String(Math.floor((e.hour % 1) * 60)).padStart(2, "0")}`}</span>
                </>
              );
            })()}
          </span>
          <section className="tank">
            <Scene
              save={save}
              label={
                save.habitat === "sea"
                  ? t("Interactive sea habitat", "Interaktive Meereswelt")
                  : t("Interactive aquarium", "Interaktives Aquarium")
              }
              tool={tool}
              reduced={reduced}
              selectedDecor={decorId}
              onFish={(id) => {
                focusFish(id);
                if (effects) effect("hello");
              }}
              onPoint={() => {
                setToolOptions(false);
                care();
              }}
              onEat={eaten}
              onFeed={purchaseFood}
              onClean={clean}
              foodKind={foodKind}
              pumpOn={world?.pumpOn ?? true}
              photoMode={takingPhoto}
              onLearn={learn}
              playCommand={playCommand}
              playGroup={playGroup}
              invitedFishId={invitedFishId}
              onInvitation={setInvitedFishId}
              onSandStart={recordLayout}
              onSand={(x) =>
                change((s) => {
                  const w = s.worlds[s.habitat];
                  w.sand = brushTerrain(
                    w.sand,
                    x,
                    tool === "sand-remove" ? -0.015 : 0.015,
                  );
                })
              }
              onDecor={(id) => {
                setDecorId(id);
                recordLayout();
              }}
              onMove={(id, x, y) =>
                change((s) => {
                  const d = s.worlds[s.habitat].decor.find((d) => d.id === id);
                  if (d) {
                    d.x = x;
                    d.y = y;
                  }
                })
              }
              canvasRef={canvas}
            />
            <div className="tank-label">
              <span className="live-dot" />
              {save.habitat === "aquarium"
                ? t("A peaceful little aquarium", "Ein friedliches Aquarium")
                : t("A little piece of the ocean", "Ein kleines Stück Ozean")}
            </div>
            <div className="tank-tools">
              <button
                aria-label={t("Share photo", "Foto teilen")}
                disabled={takingPhoto}
                aria-busy={takingPhoto}
                onClick={() => void photo()}
              >
                <Camera size={19} />
              </button>
              <button
                aria-label={
                  fullscreen
                    ? t("Exit fullscreen", "Vollbild verlassen")
                    : t("Fullscreen", "Vollbild")
                }
                aria-pressed={fullscreen}
                onClick={() => void changeFullscreen()}
              >
                <Maximize size={18} />
              </button>
            </div>
            {!world!.fish.length && tool === "feed" && !panel && (
              <div className="empty-habitat">
                <Shell size={35} />
                <h3>{t("A new beginning", "Ein neuer Anfang")}</h3>
                <p>
                  {t(
                    "Someone little would love to live here.",
                    "Ein kleiner Freund würde hier gern wohnen.",
                  )}
                </p>
                <button
                  onClick={() => {
                    setPanel("shop");
                    setTab("animals");
                  }}
                >
                  {t("Meet your new friends", "Lerne neue Freunde kennen")}{" "}
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
            <div className="tank-caption">
              {tool === "feed"
                ? t(
                    "Tap the water to sprinkle a little love.",
                    "Tippe ins Wasser und verteile etwas Liebe.",
                  )
                : tool === "play"
                  ? t(
                      "Move your finger and see who follows.",
                      "Bewege deinen Finger. Wer folgt dir?",
                    )
                  : tool === "decorate"
                    ? t(
                        "Drag a decoration to make it feel just right.",
                        "Ziehe die Deko an deinen Lieblingsplatz.",
                      )
                    : t(
                        "A little care. A lot of wonder.",
                        "Ein bisschen Fürsorge. Ganz viel Staunen.",
                      )}
            </div>
          </section>
          {tool === "explore" && world?.size && world.size !== "small" && (
            <div className="pan-controls">
              <button
                aria-label={t("Pan left", "Nach links")}
                onClick={() =>
                  canvas.current?.parentElement?.scrollBy({
                    left: -200,
                    behavior: reduced ? "instant" : "smooth",
                  })
                }
              >
                ←
              </button>
              <span>{t("Drag to explore", "Ziehen zum Erkunden")}</span>
              <button
                aria-label={t("Pan right", "Nach rechts")}
                onClick={() =>
                  canvas.current?.parentElement?.scrollBy({
                    left: 200,
                    behavior: reduced ? "instant" : "smooth",
                  })
                }
              >
                →
              </button>
            </div>
          )}
          <div className="toolbar">
            {[
              {
                id: "feed",
                en: "Feed",
                de: "Füttern",
                sub: t("A little nibble", "Ein kleiner Happen"),
                icon: <FoodIcon kind={foodKind} />,
              },
              {
                id: "play",
                en: "Play",
                de: "Spielen",
                sub: t("Make a friend", "Freunde finden"),
                icon: <Hand />,
              },
              {
                id: "decorate",
                en: "Decorate",
                de: "Gestalten",
                sub: t("Make it yours", "Ganz dein Stil"),
                icon: <Leaf />,
              },
              {
                id: "explore",
                en: "Explore",
                de: "Erkunden",
                sub: t("Drag the world", "Welt verschieben"),
                icon: <Move />,
              },
              {
                id: "shop",
                en: "Little shop",
                de: "Kleiner Laden",
                sub: t("Find something lovely", "Entdecke Schönes"),
                icon: <ShoppingBag />,
              },
            ].map((item) => (
              <button
                key={item.id}
                aria-label={`${t(item.en, item.de)} ${item.sub}`}
                title={t(item.en, item.de)}
                aria-pressed={tool === item.id}
                aria-expanded={
                  ["feed", "play"].includes(item.id)
                    ? tool === item.id &&
                      !panel &&
                      !pipOpen &&
                      (toolOptions || (!!fish && tool === "play"))
                    : undefined
                }
                className={
                  (tool === item.id ? "selected " : "") +
                  (item.id === "shop" ? "shop-button" : "")
                }
                onClick={() => {
                  setToolOptions(
                    ["feed", "play"].includes(item.id) &&
                      (item.id !== tool || !toolOptions),
                  );
                  setPanel("");
                  setFishId(null);
                  setPipOpen(false);
                  setDecorId(null);
                  if (item.id === "shop") {
                    setPanel("shop");
                    return;
                  }
                  setTool(item.id);

                  if (effects) tone(420, 0.06, 0.025);
                  if (item.id === "decorate") {
                    if (tool !== "decorate") setUndo([]);
                    setPanel("decorate");
                  }
                }}
              >
                <span className={"tool-icon " + item.id}>{item.icon}</span>
                <span>
                  {t(item.en, item.de)}
                  <small>{item.sub}</small>
                </span>
                {item.id === "shop" && <ChevronRight size={18} />}
              </button>
            ))}
          </div>
          {tool === "play" && toolOptions && !panel && !fish && (
            <aside
              className="play-tools attention-tools"
              aria-label={t("Fish games", "Fischspiele")}
            >
              {focusedFish ? (
                <>
                  <div className="attention-heading">
                    <button
                      aria-label={t("Fish details", "Fischdetails")}
                      onClick={() => setFishId(focusedFish.id)}
                    >
                      <FishIcon />
                      {focusedFish.name ||
                        animals.find((a) => a.id === focusedFish.species)![
                          lang
                        ]}
                    </button>
                    <button
                      aria-label={t("Finish playing", "Spielen beenden")}
                      onClick={() => {
                        setPlayGroup([]);
                        setPlayCommand(undefined);
                        setPlayMode("draw");
                      }}
                    >
                      <X />
                    </button>
                  </div>
                  <small role="status">
                    {playMode === "draw"
                      ? t(
                          "Draw in the water. Only your highlighted friend follows.",
                          "Zeichne im Wasser. Nur dein markierter Freund folgt dir.",
                        )
                      : t(
                          games.find((a) => a.kind === playMode)!.en,
                          games.find((a) => a.kind === playMode)!.de,
                        )}
                  </small>
                  {gameButtons(focusedFish)}
                </>
              ) : (
                <small>
                  {t(
                    "Tap a fish to play. Look for a friend with a play bubble!",
                    "Tippe einen Fisch zum Spielen an. Achte auf die Spielblase!",
                  )}
                </small>
              )}
            </aside>
          )}
          {tool === "feed" &&
            toolOptions &&
            !panel &&
            !fish &&
            !pipOpen &&
            !save?.tutorial && (
              <aside
                className="food-tools"
                aria-label={t("Food types", "Futtersorten")}
              >
                <div>
                  {[
                    ["flakes", "Flakes", "Flocken", "◒"],
                    ["pellets", "Pellets", "Granulat", "●"],
                    ["worms", "Worms", "Würmchen", "∿"],
                    ["insects", "Insects", "Insekten", "✣"],
                    ["algae", "Algae wafers", "Algentabs", "❧"],
                  ].map(([id, en, de]) => (
                    <button
                      key={id}
                      aria-label={t(en, de)}
                      aria-pressed={foodKind === id}
                      onClick={() => {
                        setFoodKind(id as FoodKind);
                        setToolOptions(false);
                      }}
                    >
                      <span aria-hidden="true">
                        <FoodIcon kind={id as FoodKind} />
                      </span>
                      <small>
                        {id === "algae" ? t("Algae", "Algen") : t(en, de)}
                      </small>
                      <small className="food-price">
                        {save.mode === "creative"
                          ? t("Free", "Gratis")
                          : `${FOOD_PRICES[id as FoodKind]} 🪙`}
                      </small>
                    </button>
                  ))}
                </div>
              </aside>
            )}
          {tool === "clean" && !panel && (
            <aside className="clean-tools">
              <Sparkles />
              <span>
                {save?.habitat === "sea"
                  ? t("Tap litter on the shore", "Tippe auf Müll am Ufer")
                  : t(
                      "Wipe the glass with your finger",
                      "Wische mit dem Finger über die Scheibe",
                    )}
              </span>
              <button onClick={() => setTool("feed")}>
                {t("Done", "Fertig")}
              </button>
            </aside>
          )}
          {tool.startsWith("sand-") && !panel && (
            <aside
              className="sand-tools"
              aria-label={t("Sand tools", "Sandwerkzeuge")}
            >
              <button
                aria-label={t("Add sand", "Sand aufschütten")}
                title={t("Add sand", "Sand aufschütten")}
                aria-pressed={tool === "sand-add"}
                onClick={() => setTool("sand-add")}
              >
                <Shovel />
              </button>
              <button
                aria-label={t("Remove sand", "Sand abtragen")}
                title={t("Remove sand", "Sand abtragen")}
                aria-pressed={tool === "sand-remove"}
                onClick={() => setTool("sand-remove")}
              >
                <Eraser />
              </button>
              <button
                aria-label={t("Undo sand", "Sand rückgängig")}
                disabled={!undo.length}
                onClick={undoLayout}
              >
                <RotateCcw />
              </button>
              <button
                aria-label={t("Finish sand", "Sand fertig")}
                onClick={() => setTool("feed")}
              >
                <Check />
              </button>
            </aside>
          )}
          {birthNotice && (
            <div className="birth-banner" role="status">
              <Heart size={23} />
              <div>
                <strong>
                  {t("A tiny new friend!", "Ein kleiner neuer Freund!")}
                </strong>
                <p>
                  {t(
                    `A baby ${animals.find((a) => a.id === birthNotice.species)!.en} has arrived in your ${birthNotice.habitat === "sea" ? "sea" : "aquarium"}.`,
                    `Ein ${animals.find((a) => a.id === birthNotice.species)!.de}-Baby ist ${birthNotice.habitat === "sea" ? "im Meer" : "im Aquarium"} angekommen.`,
                  )}
                </p>
              </div>
              <button
                className="outline"
                onClick={() => {
                  change((s) => (s.habitat = birthNotice.habitat));
                  setTool("");
                  setDecorId(null);
                  setUndo([]);
                  setPanel("");
                  setFishId(birthNotice.id);
                  setBirthNotices((old) =>
                    old.filter((n) => n.id !== birthNotice.id),
                  );
                }}
              >
                {t("Meet the baby", "Baby kennenlernen")}
                <ChevronRight size={16} />
              </button>
              <button
                className="birth-dismiss"
                aria-label={t("Dismiss baby notice", "Baby-Hinweis schließen")}
                onClick={() =>
                  setBirthNotices((old) =>
                    old.filter((n) => n.id !== birthNotice.id),
                  )
                }
              >
                <X size={17} />
              </button>
            </div>
          )}
          {tool === "decorate" && !panel && (
            <div className="tool-status">
              <button
                onClick={() => {
                  setTool("");
                  setDecorId(null);
                }}
              >
                <Check size={15} />
                {t("Done", "Fertig")}
              </button>
              {tool === "decorate" && !panel && (
                <button disabled={!undo.length} onClick={undoLayout}>
                  <RotateCcw size={15} />
                  {t("Undo", "Zurück")}
                </button>
              )}
              {tool === "decorate" && !panel && (
                <button onClick={() => setPanel("decorate")}>
                  <Plus size={15} />
                  {t("Scenery & items", "Kulisse & Deko")}
                </button>
              )}
            </div>
          )}
          {selected && tool === "decorate" && !panel && (
            <div className="decor-controls">
              <label>
                {t("Size", "Größe")}
                <input
                  aria-label={t("Decoration size", "Dekogröße")}
                  type="range"
                  min="0.3"
                  max="4"
                  step="0.1"
                  value={selected.scale}
                  onPointerDown={recordLayout}
                  onKeyDown={(e) => {
                    if (
                      [
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "Home",
                        "End",
                      ].includes(e.key)
                    )
                      recordLayout();
                  }}
                  onChange={(e) =>
                    change((s) => {
                      const d = s.worlds[s.habitat].decor.find(
                        (d) => d.id === decorId,
                      )!;
                      d.scale = +e.target.value;
                      fitEditedDecor(d);
                    })
                  }
                />
              </label>
              <label>
                {t("Rotation", "Drehen")}
                <input
                  aria-label={t("Decoration rotation", "Deko drehen")}
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={selected.rotation ?? 0}
                  onPointerDown={recordLayout}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                    )
                      recordLayout();
                  }}
                  onChange={(e) =>
                    change((s) => {
                      const d = s.worlds[s.habitat].decor.find(
                        (d) => d.id === decorId,
                      )!;
                      d.rotation = +e.target.value;
                      fitEditedDecor(d);
                    })
                  }
                />
              </label>
              <button
                onClick={() => {
                  setDecorId(null);
                }}
              >
                {t("Close controls", "Regler schließen")} <X size={16} />
              </button>
              <button
                onClick={() =>
                  placeDecor(
                    selected.kind,
                    save.inventory.includes(selected.kind),
                    selected,
                  )
                }
              >
                <Plus size={16} />
                {t("Add another", "Noch eins")}
              </button>
              {btn(t("Flip", "Spiegeln"), <FlipHorizontal size={16} />, () => {
                recordLayout();
                change((s) => {
                  const d = s.worlds[s.habitat].decor.find(
                    (d) => d.id === decorId,
                  )!;
                  d.flip = !d.flip;
                });
              })}
              {btn(t("Front", "Nach vorn"), <Layers size={16} />, () => {
                recordLayout();
                change(
                  (s) =>
                    (s.worlds[s.habitat].decor.find(
                      (d) => d.id === decorId,
                    )!.layer = Date.now()),
                );
              })}
              {btn(t("Put away", "Weglegen"), <Trash2 size={16} />, () => {
                recordLayout();
                change((s) => {
                  s.inventory.push(selected.kind);
                  s.worlds[s.habitat].decor = s.worlds[s.habitat].decor.filter(
                    (d) => d.id !== decorId,
                  );
                });
                setDecorId(null);
              })}
            </div>
          )}
          <div className="under-tank">
            <span>
              <Heart size={15} />
              {t(
                "Happy fish, happy place. No perfect caretakers needed.",
                "Glückliche Fische. Dein Wohlfühlort. Ganz ohne Pflegestress.",
              )}
            </span>
            <span>
              {storageError
                ? t(
                    "Not saved — storage unavailable",
                    "Nicht gespeichert — Speicher nicht verfügbar",
                  )
                : t("Saved in this browser", "In diesem Browser gespeichert")}
              <Check size={14} />
            </span>
          </div>
        </main>
      )}
      <footer>
        <span>
          little fishtank{" "}
          <span className="footer-dot">
            <Sparkles size={10} />
          </span>{" "}
          {t("made for little moments of joy", "für kleine Glücksmomente")}
        </span>
        <button onClick={() => setPanel("settings")}>
          {lang === "en" ? "EN" : "DE"} · v{VERSION}
        </button>
      </footer>
      {storageError && (
        <div className="error-banner">
          {t(
            "Browser storage is unavailable. Your latest changes may not be saved.",
            "Browserspeicher nicht verfügbar. Die letzten Änderungen sind eventuell nicht gespeichert.",
          )}
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <Sparkles size={18} />
          {toast}
        </div>
      )}
      {newSlot !== null && (
        <div className="overlay">
          <section className="modal">
            <button
              className="close"
              aria-label={t("Close", "Schließen")}
              onClick={() => setNewSlot(null)}
            >
              <X />
            </button>
            <div className="modal-symbol">
              <FishIcon />
            </div>
            <h2>
              {t(
                "Something lovely starts here.",
                "Hier beginnt etwas Schönes.",
              )}
            </h2>
            <p>
              {t(
                "Two habitats. One little world. What will you make?",
                "Zwei Wasserwelten. Dein kleines Reich. Was gestaltest du?",
              )}
            </p>
            <label>
              {t("Name your world", "Gib deiner Welt einen Namen")}
              <input
                autoFocus
                maxLength={40}
                placeholder={t("My little paradise", "Mein kleines Paradies")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className="mode-options">
              <button
                className={mode === "progression" ? "chosen" : ""}
                onClick={() => setMode("progression")}
              >
                <Leaf />
                <strong>{t("Grow & discover", "Wachsen & entdecken")}</strong>
                <small>
                  {t(
                    "Care, earn coins, unlock lovely things.",
                    "Pflegen, Münzen verdienen, Schönes freischalten.",
                  )}
                </small>
              </button>
              <button
                className={mode === "creative" ? "chosen" : ""}
                onClick={() => setMode("creative")}
              >
                <Sparkles />
                <strong>{t("Just imagine", "Einfach gestalten")}</strong>
                <small>
                  {t(
                    "Everything is yours. Let creativity swim.",
                    "Alles ist frei. Lass deine Fantasie schwimmen.",
                  )}
                </small>
              </button>
            </div>
            <button
              className="primary wide"
              onClick={() => {
                const s = createSave(
                  newSlot,
                  name.trim() ||
                    t("My little paradise", "Mein kleines Paradies"),
                  mode,
                );
                void openSave(s);
              }}
            >
              {t("Let’s dive in", "Tauchen wir ein")}
              <Waves size={18} />
            </button>
            <small className="hint">
              {t(
                "Your mode stays with this world. You have three save slots.",
                "Der Modus bleibt für diese Welt. Du hast drei Speicherplätze.",
              )}
            </small>
          </section>
        </div>
      )}
      {save &&
        pipOpen &&
        !save.tutorial &&
        !panel &&
        !fish &&
        tool !== "decorate" &&
        tool !== "explore" && (
          <Pip
            lang={lang}
            chapter={
              !Object.values(save.worlds).some((w) =>
                w.fish.some((f) => f.name.trim()),
              )
                ? 0
                : !save.story?.fed
                  ? 1
                  : !save.story?.planted
                    ? 2
                    : 3
            }
            open={pipOpen}
            onOpen={() => setPipOpen((v) => !v)}
            onClose={() => {
              setPipOpen(false);
              change((s) => {
                s.story ??= { fed: false, planted: false, hidden: false };
                s.story.hidden = true;
              });
            }}
            onAction={() => {
              setPipOpen(false);
              const named = Object.values(save.worlds).some((w) =>
                w.fish.some((f) => f.name.trim()),
              );
              if (!named && world?.fish[0]) {
                setFishId(world.fish[0].id);
              } else if (!save.story?.fed) setTool("feed");
              else if (!save.story?.planted) {
                setTool("decorate");
                setPanel("decorate");
              }
            }}
          />
        )}
      {fish && save && (
        <div className="overlay friend-overlay" onClick={() => setFishId(null)}>
          <section
            className="modal fish-modal compact-friend"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              aria-label={t("Close", "Schließen")}
              onClick={() => setFishId(null)}
            >
              <X />
            </button>
            <div className="individual-portrait">
              <Artwork fish={fish} />
            </div>
            <h2>
              {fish.name || animals.find((a) => a.id === fish.species)![lang]}
            </h2>
            <label>
              {t("A name for your friend", "Ein Name für deinen Freund")}
              <input
                maxLength={32}
                value={fish.name}
                placeholder={t("Give me a name…", "Gib mir einen Namen…")}
                onChange={(e) =>
                  change((s) => {
                    s.worlds[s.habitat].fish.find(
                      (f) => f.id === fishId,
                    )!.name = e.target.value;
                  })
                }
              />
            </label>
            {canPlaySpecies(fish) ? (
              <div className="fish-actions">
                <small>
                  {t(
                    "Your playmate · only this fish follows",
                    "Dein Spielfreund · nur dieser Fisch folgt",
                  )}
                </small>
                {gameButtons(fish)}
                {!fish.trick && (
                  <small>
                    {t(
                      "Draw a trail first to unlock Replay.",
                      "Zeichne zuerst eine Spur zum Wiederholen.",
                    )}
                  </small>
                )}
              </div>
            ) : (
              <small className="trick-memory">
                {t(
                  "This friend enjoys watching and exploring at its own pace.",
                  "Dieser Freund schaut lieber zu und erkundet in Ruhe.",
                )}
              </small>
            )}
            <button
              className="fish-book"
              onClick={() => {
                setGuideSpecies(fish.species);
                setFishId(null);
                setPanel("guide");
              }}
            >
              <BookOpen size={16} />
              {t("Discover this species", "Diese Art entdecken")}
            </button>
            {fish.trick && (
              <small className="trick-memory">
                {t("Learned trail", "Gelernte Spur")} · {fish.trick.rehearsals}{" "}
                {t("lessons", "Übungen")}
              </small>
            )}
            {fish.parents && (
              <p className="born-here">
                <Heart size={14} />
                {t(
                  "Born in your little world",
                  "In deiner kleinen Welt geboren",
                )}
              </p>
            )}
            <div className="fish-stats">
              <span>
                {t("Age", "Alter")}
                <strong>
                  {Math.max(0, Math.floor((Date.now() - fish.born) / 60000))}{" "}
                  {t("min", "Min.")}
                </strong>
              </span>
              <span>
                {t("Feeling", "Stimmung")}
                <strong>
                  {fish.mood > 70
                    ? t("Happy", "Glücklich")
                    : t("Content", "Zufrieden")}{" "}
                  <Heart size={12} aria-hidden="true" />
                </strong>
              </span>
              <span>
                {t("Appetite", "Appetit")}
                <strong>
                  {fish.hunger <= 15
                    ? t("Full", "Satt")
                    : fish.hunger > 65
                      ? t("Peckish", "Hungrig")
                      : t("Doing fine", "Alles gut")}
                </strong>
              </span>
              <span>
                {t("Personality", "Charakter")}
                <strong>
                  {fish.playful > 0.5
                    ? t("Playful", "Verspielt")
                    : t("Dreamy", "Verträumt")}
                </strong>
              </span>
            </div>
            <div className="growth-label">
              {t("Growing up", "Wird erwachsen")}
              <b>{Math.round(progress(fish) * 100)}%</b>
            </div>
            <progress max={1} value={progress(fish)} />
            <button
              className="outline wide"
              onClick={() =>
                setConfirm({
                  text:
                    save.mode === "creative"
                      ? t(
                          "Let this friend move out?",
                          "Diesen Freund ausziehen lassen?",
                        )
                      : t(
                          `Sell ${fish.name || animals.find((a) => a.id === fish.species)!.en} for ${value(fish)} coins?`,
                          `${fish.name || animals.find((a) => a.id === fish.species)!.de} für ${value(fish)} Münzen verkaufen?`,
                        ),
                  action: () => {
                    setSave((s) => (s ? rescue(sell(s, fish.id)) : s));
                    setFishId(null);
                    if (effects) tone(880);
                  },
                })
              }
            >
              {save.mode === "creative"
                ? t("Let move out", "Ausziehen lassen")
                : t(
                    `Sell for ${value(fish)} coins`,
                    `Für ${value(fish)} Münzen verkaufen`,
                  )}
              <Coins size={17} />
            </button>
          </section>
        </div>
      )}
      {panel && (
        <div
          className={`overlay panel-overlay panel-${panel}`}
          onClick={() => setPanel("")}
        >
          <section
            className={
              "modal " +
              (["shop", "decorate"].includes(panel) ? "shop-modal" : "")
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              aria-label={t("Close", "Schließen")}
              onClick={() => setPanel("")}
            >
              <X />
            </button>
            {panel === "guide" && (
              <Suspense
                fallback={
                  <p role="status">
                    {t("Opening the book…", "Das Buch wird geöffnet…")}
                  </p>
                }
              >
                <FieldGuide lang={lang} initialSpecies={guideSpecies} />
              </Suspense>
            )}
            {panel === "menu" && (
              <>
                <div className="eyebrow">LITTLE FISHTANK</div>
                <h2>{t("A moment to surface.", "Kurz auftauchen.")}</h2>
                <LanguageSwitch lang={lang} onChange={setLang} />
                <div className="menu-list">
                  {save &&
                    btn(
                      t("Toggle sound (M)", "Ton umschalten (M)"),
                      muted ? <VolumeX /> : <Volume2 />,
                      () => setMuted((v) => !v),
                    )}
                  {btn(t("Field guide", "Entdeckerbuch"), <BookOpen />, () => {
                    setGuideSpecies(null);
                    setPanel("guide");
                  })}
                  {save &&
                    btn(
                      t("My worlds", "Meine Welten"),
                      <FishIcon />,
                      () => void home(),
                    )}
                  {save &&
                    btn(
                      fullscreen
                        ? t("Exit fullscreen", "Vollbild verlassen")
                        : t("Fullscreen", "Vollbild"),
                      <Maximize />,
                      () => {
                        setPanel("");
                        void changeFullscreen();
                      },
                    )}
                  {save &&
                    btn(
                      t("Share a postcard", "Postkarte teilen"),
                      <Camera />,
                      () => void photo(),
                    )}
                  {save &&
                    btn(
                      save.habitat === "aquarium"
                        ? t(
                            "Homework · coming next",
                            "Hausaufgaben · demnächst",
                          )
                        : t("Mini job · coming next", "Mini-Job · demnächst"),
                      save.habitat === "aquarium" ? <Pencil /> : <Leaf />,
                      () => setPanel("future-job"),
                    )}
                  {btn(t("Settings", "Einstellungen"), <Settings />, () =>
                    setPanel("settings"),
                  )}
                  {btn(
                    installed
                      ? t("App installed", "App installiert")
                      : t("Install app", "App installieren"),
                    <Download />,
                    () => setPanel("install"),
                  )}
                  {btn(t("How to play", "So wird gespielt"), <Heart />, () =>
                    setPanel("help"),
                  )}
                  {update &&
                    btn(
                      t("Save and update", "Speichern und aktualisieren"),
                      <Download />,
                      () => void activateUpdate(),
                    )}
                </div>
                {save?.mode === "progression" && (
                  <p>
                    {t(
                      "Pocket money: 5 coins each minute you play. Fish sales unlock new species.",
                      "Taschengeld: 5 Münzen pro Spielminute. Fischverkäufe schalten neue Arten frei.",
                    )}
                  </p>
                )}
                <small>v{VERSION} · © 2026 expeter · MIT</small>
              </>
            )}
            {panel === "future-job" && save && (
              <>
                <h2>
                  {save.habitat === "aquarium"
                    ? t("Homework club", "Hausaufgabenclub")
                    : t("Little nature helpers", "Kleine Naturhelfer")}
                </h2>
                <p>
                  {t(
                    "Coming in a later version",
                    "Für eine spätere Version geplant",
                  )}
                </p>
                <p>
                  {save.habitat === "aquarium"
                    ? t(
                        "Earn coins with tiny German, maths, English and physics challenges. Choose your level from 1–10.",
                        "Verdiene Münzen mit kleinen Aufgaben in Deutsch, Mathe, Englisch und Physik. Wähle deine Stufe von 1–10.",
                      )
                    : t(
                        "Earn coins with little environmental jobs by the coast. For now, you can already tidy the shore using the decorating tools.",
                        "Verdiene Münzen mit kleinen Umweltaufträgen an der Küste. Schon jetzt kannst du mit den Gestaltungswerkzeugen das Ufer säubern.",
                      )}
                </p>
              </>
            )}
            {panel === "residents" && world && (
              <>
                <h2>{t("Your little friends", "Deine kleinen Freunde")}</h2>
                <div className="menu-list">
                  {world.fish.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFishId(f.id);
                        setPanel("");
                      }}
                    >
                      <FishIcon color={fishColor(f)} />
                      {f.name || animals.find((a) => a.id === f.species)![lang]}
                      <small>{Math.round(progress(f) * 100)}%</small>
                      <ChevronRight size={15} />
                    </button>
                  ))}
                </div>
              </>
            )}
            {panel === "settings" && (
              <>
                <h2>
                  {t("Just your kind of cozy.", "So fühlst du dich wohl.")}
                </h2>
                <label>
                  {t("Language", "Sprache")}
                  <select
                    aria-label={t("Language", "Sprache")}
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                  >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </label>
                <div className="settings-list">
                  {[
                    [
                      t("Sound on", "Ton an"),
                      !muted,
                      () => setMuted((v) => !v),
                    ],
                    [
                      t("Gentle music", "Sanfte Musik"),
                      music,
                      () => setMusic((v) => !v),
                    ],
                    [
                      t("Little sound effects", "Kleine Klänge"),
                      effects,
                      () => setEffects((v) => !v),
                    ],
                    [
                      t("Reduced motion", "Weniger Bewegung"),
                      reduced,
                      () => setReduced((v) => !v),
                    ],
                  ].map(([label, on, action]) => (
                    <button
                      key={String(label)}
                      role="switch"
                      aria-checked={Boolean(on)}
                      onClick={action as () => void}
                    >
                      <span>{String(label)}</span>
                      <span className={"toggle " + (on ? "on" : "")}>
                        <i />
                      </span>
                    </button>
                  ))}
                </div>
                {save && (
                  <div className="nature-switch">
                    <button
                      role="switch"
                      aria-checked={!!save.predators}
                      onClick={() => {
                        if (save.predators)
                          change((s) => {
                            s.predators = false;
                          });
                        else
                          setConfirm({
                            text: t(
                              "Turn on food-chain play? Some grown fish may eat unnamed newborns of other species. Named friends and bought animals stay safe. This only happens while playing.",
                              "Nahrungsketten-Spiel einschalten? Manche großen Fische können unbenannte Jungtiere anderer Arten fressen. Benannte Freunde und gekaufte Tiere bleiben sicher. Das passiert nur beim Spielen.",
                            ),
                            action: () =>
                              change((s) => {
                                s.predators = true;
                              }),
                          });
                      }}
                    >
                      <span>
                        {t("Food-chain play", "Nahrungsketten-Spiel")}
                      </span>
                      <span
                        className={"toggle " + (save.predators ? "on" : "")}
                      >
                        <i />
                      </span>
                    </button>
                    <small>
                      {t(
                        "Optional nature discovery · off by default",
                        "Natur entdecken · anfangs ausgeschaltet",
                      )}
                    </small>
                  </div>
                )}
                <p>
                  {t(
                    "Press M for a quiet moment.",
                    "Drücke M für einen ruhigen Moment.",
                  )}
                </p>
              </>
            )}
            {panel === "install" && (
              <>
                <div className="modal-symbol">
                  <Download />
                </div>
                <h2>
                  {t(
                    "A little home on your phone.",
                    "Ein Zuhause auf deinem Handy.",
                  )}
                </h2>
                <p>
                  {t(
                    "Install Little Fishtank to open your worlds like an app, even offline after your first visit.",
                    "Installiere Little Fishtank und öffne deine Welten wie eine App – nach dem ersten Besuch auch offline.",
                  )}
                </p>
                {installed ? (
                  <p className="callout">
                    {t(
                      "This game is already installed. Open it from your home screen whenever you like.",
                      "Dieses Spiel ist bereits installiert. Öffne es jederzeit über deinen Startbildschirm.",
                    )}
                  </p>
                ) : installing ? (
                  <p role="status">
                    {t(
                      "Opening installation options…",
                      "Installationsoptionen werden geöffnet…",
                    )}
                  </p>
                ) : install ? (
                  <button
                    className="primary wide"
                    onClick={() => void requestInstallation()}
                  >
                    {t(
                      "Install Little Fishtank",
                      "Little Fishtank installieren",
                    )}
                  </button>
                ) : (
                  <p className="callout">
                    {t(
                      "In your browser menu, choose “Install app” or “Add to Home Screen”. On iPhone, open Safari’s Share menu and choose Add to Home Screen.",
                      "Wähle im Browsermenü „App installieren“ oder „Zum Startbildschirm hinzufügen“. Auf dem iPhone: Öffne in Safari das Teilen-Menü und wähle „Zum Home-Bildschirm“.",
                    )}
                  </p>
                )}
              </>
            )}
            {panel === "help" && (
              <>
                <HelpGuide lang={lang} />
                {save && (
                  <button
                    className="outline"
                    onClick={() => {
                      setPanel("");
                      setToolOptions(false);
                      setPipOpen(true);
                    }}
                  >
                    {t("Meet Pip", "Pip kennenlernen")}
                  </button>
                )}
              </>
            )}
            {panel === "shop" && save && (
              <>
                <div className="eyebrow">
                  <ShoppingBag size={15} />
                  {t("A FEW LOVELY THINGS", "EIN PAAR SCHÖNE DINGE")}
                </div>
                <h2>{t("The little shop", "Der kleine Laden")}</h2>
                <p className="shop-wallet" aria-live="polite">
                  {save.mode === "creative"
                    ? t(
                        "Pick anything. This world is your canvas.",
                        "Wähle, was dir gefällt. Diese Welt gehört dir.",
                      )
                    : t(
                        `${save.coins} coins to spend`,
                        `${save.coins} Münzen verfügbar`,
                      )}
                </p>
                {save.mode === "progression" && (
                  <div className="discovery-progress">
                    <div>
                      <Sparkles size={17} />
                      <strong>
                        {nextUnlock
                          ? t("Your next discovery", "Deine nächste Entdeckung")
                          : t(
                              "Every discovery is unlocked!",
                              "Alle Entdeckungen sind freigeschaltet!",
                            )}
                      </strong>
                    </div>
                    {nextUnlock ? (
                      <>
                        <p>
                          {t(
                            `Sell grown fish to reach ${nextUnlock} total coins earned.`,
                            `Verkaufe erwachsene Fische und verdiene insgesamt ${nextUnlock} Münzen.`,
                          )}
                        </p>
                        <progress
                          aria-label={t(
                            "Progress toward the next unlock",
                            "Fortschritt zur nächsten Freischaltung",
                          )}
                          max={nextUnlock}
                          value={save.earned}
                        />
                        <small>
                          {t("Lifetime sales", "Verkäufe insgesamt")}:{" "}
                          {save.earned} / {nextUnlock}
                        </small>
                      </>
                    ) : (
                      <p>
                        {t(
                          "Keep growing, playing, and making this world your own.",
                          "Lass deine Welt weiter wachsen, spiele und gestalte sie nach deinem Geschmack.",
                        )}
                      </p>
                    )}
                  </div>
                )}
                <div className="segmented">
                  <button
                    aria-label={t("Little friends", "Kleine Freunde")}
                    className={tab === "animals" ? "active" : ""}
                    onClick={() => setTab("animals")}
                  >
                    <FishIcon size={17} />
                    {t("Animals", "Tiere")}
                  </button>
                  <button
                    className={tab === "critters" ? "active" : ""}
                    onClick={() => setTab("critters")}
                  >
                    <Shell size={17} />
                    {t("Little helpers", "Helfer")}
                  </button>
                  <button
                    aria-label={t("Lovely things", "Schöne Dinge")}
                    className={tab === "decor" ? "active" : ""}
                    onClick={() => setTab("decor")}
                  >
                    <Leaf size={17} />
                    {t("Decor", "Deko")}
                  </button>
                </div>
                {save.mode === "creative" && tab !== "decor" && (
                  <div
                    className="animal-age"
                    role="group"
                    aria-label={t("Animal age", "Alter der Tiere")}
                  >
                    <button
                      aria-pressed={!adult}
                      onClick={() => setAdult(false)}
                    >
                      {t("Babies", "Babys")}
                    </button>
                    <button aria-pressed={adult} onClick={() => setAdult(true)}>
                      {t("Grown-ups", "Erwachsene")}
                    </button>
                  </div>
                )}
                <div className="catalog">
                  {tab !== "decor"
                    ? animals
                        .filter(
                          (a) =>
                            canLiveIn(a.id, save.habitat) &&
                            (tab !== "critters" ||
                              ["snail", "crab", "shrimp", "frog"].includes(
                                a.id,
                              )),
                        )
                        .map((a) => (
                          <button
                            key={a.id}
                            disabled={
                              !unlocked(a.tier) ||
                              (save.mode === "progression" &&
                                save.coins < prices[a.tier])
                            }
                            onClick={() => buyAnimal(a.id)}
                          >
                            <div
                              className="catalog-art"
                              style={{ color: a.color }}
                            >
                              <Artwork animal={a.id} />
                            </div>
                            <strong>{a[lang]}</strong>
                            <small>
                              {!unlocked(a.tier) ? (
                                <>
                                  <Lock size={12} />
                                  {tiers[a.tier]} {t("earned", "verdient")}
                                </>
                              ) : save.mode === "creative" ? (
                                <>
                                  <Plus size={13} />
                                  {t("Add friend", "Hinzufügen")}
                                </>
                              ) : (
                                <>
                                  <Coins size={13} />
                                  {prices[a.tier]}
                                </>
                              )}
                            </small>
                          </button>
                        ))
                    : decorations
                        .filter((d) => d.habitat === save.habitat)
                        .map((d) => (
                          <button
                            key={d.id}
                            disabled={
                              !unlocked(d.tier) ||
                              (save.mode === "progression" &&
                                save.coins < d.price)
                            }
                            onClick={() => placeDecor(d.id)}
                          >
                            <div
                              className={"catalog-art decor-art art-" + d.kind}
                            >
                              <Artwork decor={d.id} />
                            </div>
                            <strong>{d[lang]}</strong>
                            <small>
                              {!unlocked(d.tier) ? (
                                <>
                                  <Lock size={12} />
                                  {tiers[d.tier]} {t("earned", "verdient")}
                                </>
                              ) : save.mode === "creative" ? (
                                t("Place", "Platzieren")
                              ) : (
                                <>
                                  <Coins size={13} />
                                  {d.price}
                                </>
                              )}
                            </small>
                          </button>
                        ))}
                </div>
              </>
            )}
            {panel === "decorate" && save && world && (
              <>
                <div className="eyebrow">
                  <Leaf size={15} />
                  {t("MAKE YOURSELF AT HOME", "MACH ES DIR GEMÜTLICH")}
                </div>
                <h2>{t("A world your way", "Deine Welt, dein Stil")}</h2>
                {save.habitat === "sea" && (
                  <div className="tank-equipment">
                    <button
                      onClick={() => {
                        setTool("clean");
                        setPanel("");
                        setDecorId(null);
                      }}
                    >
                      <Sparkles />
                      {t("Clean shore", "Ufer säubern")}
                    </button>
                  </div>
                )}
                {save.habitat === "aquarium" && (
                  <div className="tank-equipment">
                    <button
                      onClick={() => {
                        setTool("clean");
                        setPanel("");
                        setDecorId(null);
                      }}
                    >
                      <Sparkles />
                      {t("Clean window", "Scheibe putzen")}
                    </button>
                    <button
                      role="switch"
                      aria-checked={world.pumpOn ?? true}
                      onClick={() =>
                        change((s) => {
                          s.worlds.aquarium.pumpOn = !(
                            s.worlds.aquarium.pumpOn ?? true
                          );
                        })
                      }
                    >
                      <Wind />
                      {t("Air pump", "Luftpumpe")} ·{" "}
                      {(world.pumpOn ?? true) ? t("On", "An") : t("Off", "Aus")}
                    </button>
                  </div>
                )}
                <h3>{t("Set the mood", "Wähle die Stimmung")}</h3>
                <div className="swatches">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      className={
                        "swatch swatch-" +
                        i +
                        (world.background === i ? " chosen" : "")
                      }
                      aria-pressed={world.background === i}
                      onClick={() => {
                        recordLayout();
                        change((s) => (s.worlds[s.habitat].background = i));
                      }}
                    >
                      <Sun size={20} />
                      {
                        [
                          t("Daydream", "Tagtraum"),
                          t("Blue lagoon", "Blaue Lagune"),
                          t("Twilight", "Abendlicht"),
                        ][i]
                      }
                    </button>
                  ))}
                </div>
                <h3>{t("Under your fins", "Unter deinen Flossen")}</h3>
                <div className="swatches">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      className={world.ground === i ? "chosen" : ""}
                      aria-pressed={world.ground === i}
                      onClick={() => {
                        recordLayout();
                        change((s) => (s.worlds[s.habitat].ground = i));
                      }}
                    >
                      {
                        [
                          t("Soft sand", "Weicher Sand"),
                          t("Riverbed", "Flussbett"),
                          t("Rose pebbles", "Rosenkiesel"),
                        ][i]
                      }
                    </button>
                  ))}
                </div>
                <div className="sand-actions">
                  <button
                    onClick={() => {
                      setPanel("");
                      setDecorId(null);
                      setTool("sand-add");
                    }}
                  >
                    <Shovel size={18} />
                    {t("Scoop sand", "Sand schaufeln")}
                  </button>
                </div>
                <h3>{t("Your collection", "Deine Sammlung")}</h3>
                <div className="inventory">
                  {save.inventory
                    .filter(
                      (id) =>
                        decorations.find((d) => d.id === id)?.habitat ===
                        save.habitat,
                    )
                    .map((id, i) => (
                      <button key={i} onClick={() => placeDecor(id, true)}>
                        <Leaf size={18} />
                        {decorations.find((d) => d.id === id)![lang]}
                        <Plus size={15} />
                      </button>
                    ))}
                </div>
                <div className="modal-actions">
                  <button
                    className="outline"
                    disabled={!undo.length}
                    onClick={undoLayout}
                    aria-label={t(
                      "Undo last edit",
                      "Letzte Änderung zurücknehmen",
                    )}
                  >
                    <RotateCcw size={16} />
                    {t("Undo", "Zurück")}
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setPanel("shop");
                      setTab("decor");
                    }}
                  >
                    <ShoppingBag size={17} />
                    {t("Find more", "Mehr entdecken")}
                  </button>
                </div>
                <p className="hint">
                  {t(
                    "Close this panel to move things around. Undo keeps purchases in your collection.",
                    "Schließe dieses Fenster, um Deko zu bewegen. Gekaufte Dinge bleiben beim Rückgängigmachen in deiner Sammlung.",
                  )}
                </p>
              </>
            )}
          </section>
        </div>
      )}
      {postcard && (
        <div className="overlay">
          <section
            className="modal postcard-modal"
            role="dialog"
            aria-label={t(
              "Your underwater postcard",
              "Deine Unterwasser-Postkarte",
            )}
          >
            <button
              className="close"
              aria-label={t("Close", "Schließen")}
              disabled={sharingPhoto}
              onClick={() => setPostcard(null)}
            >
              <X />
            </button>
            <h2>
              {t("A little joy to share.", "Ein bisschen Freude zum Teilen.")}
            </h2>
            <img
              src={postcard.url}
              alt={t(
                "Your underwater world, without menus",
                "Deine Unterwasserwelt ohne Menüs",
              )}
            />
            <p>
              {t(
                "Send a little underwater hello, or keep this moment for yourself.",
                "Verschicke einen kleinen Unterwassergruß oder behalte diesen Moment für dich.",
              )}
            </p>
            <label className="postcard-message">
              {t("Your greeting (optional)", "Dein Gruß (freiwillig)")}
              <textarea
                aria-label={t("Postcard message", "Postkartentext")}
                maxLength={180}
                rows={2}
                value={postcardMessage}
                onChange={(e) => {
                  setPostcardBusy(true);
                  setPostcardMessage(e.target.value);
                }}
                placeholder={t(
                  "Greetings from our little underwater world!",
                  "Liebe Grüße aus unserer kleinen Unterwasserwelt!",
                )}
              />
              <small>{postcardMessage.length}/180</small>
            </label>
            <div className="modal-actions">
              <button
                className="primary"
                disabled={
                  sharingPhoto || postcardBusy || !canSharePhoto(postcard.file)
                }
                onClick={() => void sharePostcard()}
              >
                <Camera size={17} />
                {t("Share postcard", "Postkarte teilen")}
              </button>
              <button
                className="outline"
                disabled={sharingPhoto || postcardBusy}
                onClick={() => downloadPhoto(postcard.file)}
              >
                <Download size={17} />
                {t("Save image", "Bild speichern")}
              </button>
            </div>
          </section>
        </div>
      )}
      {confirm && (
        <div className="overlay confirmation">
          <section className="modal">
            <h2>{t("Just making sure", "Nur zur Sicherheit")}</h2>
            <p>{confirm.text}</p>
            <div className="modal-actions">
              <button className="outline" onClick={() => setConfirm(null)}>
                {t("Keep things as they are", "Alles so lassen")}
              </button>
              <button
                className="primary"
                onClick={() => {
                  confirm.action();
                  setConfirm(null);
                }}
              >
                {t("Yes, please", "Ja, bitte")}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
