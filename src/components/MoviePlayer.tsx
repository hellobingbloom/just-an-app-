import { useState, useEffect, useCallback, useRef } from "react";
import { WifiOff, CloudDownload, Share2, Check, Plus, Download, ChevronDown, Maximize, Minimize, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playerSandbox, supportsRedirectProtection } from "@/lib/playerRedirectProtection";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toggleMyList, isInMyList } from "@/hooks/useMyList";
import DownloadSourceSheet from "@/components/DownloadSourceSheet";
import InlineAdRow from "@/components/InlineAdRow";
import { trackMediaView } from "@/lib/analytics";

const SERVER_PREF_KEY = "bb:player:server:v2";

type ServerKey = "cinesrc" | "vidbolt" | "nova" | "crimson" | "helix" | "astra" | "ironclad" | "vale" | "smashystreams" | "dumbo" | "lumen";

interface Server {
  id: ServerKey;
  label: string;
  url: (type: "movie" | "tv", tmdbId: string, season: number, episode: number) => string;
}

const SERVERS: Server[] = [
  { id: "cinesrc", label: "CineSrc", url: (type, id, s, e) => type === "tv" ? `https://cinesrc.st/embed/tv/${id}/${s}/${e}` : `https://cinesrc.st/embed/movie/${id}` },
  { id: "nova", label: "Nova", url: (type, id, s, e) => type === "tv" ? `https://moviesapi.to/tv/${id}/${s}/${e}` : `https://moviesapi.to/movie/${id}` },
  { id: "vale", label: "Vale", url: (type, id, s, e) => type === "tv" ? `https://vidzen.fun/tv/${id}/${s}/${e}` : `https://vidzen.fun/movie/${id}` },
  { id: "smashystreams", label: "SmashyStreams", url: (type, id, s, e) => type === "tv" ? `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}` : `https://embed.smashystream.com/playere.php?tmdb=${id}` },
  { id: "dumbo", label: "Dumbo", url: (type, id, s, e) => type === "tv" ? `https://dulo.mov/watch/tv/${id}/${s}/${e}` : `https://dulo.mov/watch/movie/${id}` },
  { id: "vidbolt", label: "VidBolt", url: (type, id, s, e) => type === "tv" ? `https://vidbolt.xyz/tv/${id}/${s}/${e}?theme=9b5cff` : `https://vidbolt.xyz/movie/${id}?theme=9b5cff` },
  { id: "crimson", label: "Crimson", url: (type, id, s, e) => type === "tv" ? `https://vidcore.io/tv/${id}/${s}/${e}` : `https://vidcore.io/movie/${id}` },
  { id: "helix", label: "Helix", url: (type, id, s, e) => type === "tv" ? `https://vidnest.fun/tv/${id}/${s}/${e}` : `https://vidnest.fun/movie/${id}` },
  { id: "astra", label: "Astra", url: (type, id, s, e) => type === "tv" ? `https://vidlink.pro/tv/${id}/${s}/${e}` : `https://vidlink.pro/movie/${id}` },
  { id: "ironclad", label: "Ironclad", url: (type, id, s, e) => type === "tv" ? `https://vidsrcme.ru/embed/tv/${id}/${s}/${e}` : `https://vidsrcme.ru/embed/movie/${id}` },
  { id: "lumen", label: "Lumen", url: (type, id, s, e) => type === "tv" ? `https://embed.filmu.in/tv/${id}/${s}/${e}` : `https://embed.filmu.in/movie/${id}` },
];

// Kept as a legacy type so existing pages that pass `serverId`/`onServerChange`
// still typecheck.
export type ServerId = string;

interface Props {
  tmdbId: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  serverId?: ServerId;
  onServerChange?: (id: ServerId) => void;
  title?: string;
  year?: string;
  poster?: string | null;
  backdrop?: string | null;
  onPrev?: () => void;
  onNext?: () => void;
  nextItem?: { title: string; poster?: string | null; subtitle?: string } | null;
}

const MoviePlayer = ({
  tmdbId,
  type = "movie",
  season = 1,
  episode = 1,
  title,
  year,
  poster,
  backdrop,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const online = useOnlineStatus();
  const [server, setServer] = useState<ServerKey>(() => {
    try {
      const saved = localStorage.getItem(SERVER_PREF_KEY) as ServerKey | null;
      if (saved && SERVERS.some((s) => s.id === saved)) return saved;
    } catch {
      /* ignore */
    }
    return "cinesrc";
  });

  const active = SERVERS.find((s) => s.id === server) || SERVERS[0];
  const embedUrl = active.url(type, tmdbId, season, episode);
  const [redirectProtection, setRedirectProtection] = useState(false);
  const sandbox = playerSandbox(server, redirectProtection);

  const pickServer = (id: ServerKey) => {
    setServer(id);
    try {
      localStorage.setItem(SERVER_PREF_KEY, id);
    } catch {
      /* ignore */
    }
  };

  // ---- Full screen ---------------------------------------------------------
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const fsEl =
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        null;
      setIsFullscreen(!!fsEl);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> })
      | null;
    const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> };
    const active = document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement;
    try {
      if (active) {
        await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
      } else if (el) {
        await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.());
        if (window.matchMedia("(max-width: 767px)").matches) {
          const orientation = screen.orientation as ScreenOrientation & {
            lock?: (orientation: "landscape") => Promise<void>;
          };
          await orientation.lock?.("landscape").catch(() => undefined);
        }
      }
    } catch {
      /* device refused fullscreen — ignore */
    }
  }, []);

  // ---- In-player actions: download, share, watchlist -----------------------
  const listItemId = `${type}-${tmdbId}`;
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [inList, setInList] = useState(() => isInMyList(listItemId));

  useEffect(() => {
    setInList(isInMyList(listItemId));
  }, [listItemId]);

  const shareLink = useCallback(async () => {
    const url =
      type === "tv"
        ? `${window.location.origin}/watch/tv/${tmdbId}/${season}/${episode}`
        : `${window.location.origin}/watch/movie/${tmdbId}`;
    const shareTitle = title || "BingBloom";
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url });
        return;
      }
    } catch {
      /* user cancelled — fall through to copying */
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — share it to let anyone watch this.");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }, [type, tmdbId, season, episode, title]);

  const toggleWatchlist = useCallback(() => {
    const added = toggleMyList({
      id: listItemId,
      title: title || "Untitled",
      thumbnail: poster || backdrop || "",
      channel: type === "tv" ? "TV Show" : "Movie",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    setInList(added);
  }, [listItemId, title, poster, backdrop, type]);

  // Record each movie / episode view exactly once per title change.
  useEffect(() => {
    if (!tmdbId) return;
    trackMediaView({
      type,
      id: String(tmdbId),
      title,
      season: type === "tv" ? season : undefined,
      episode: type === "tv" ? episode : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId, type, season, episode]);

  if (!online) {
    return (
      <div className="w-full bg-background">
        <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/5">
            <WifiOff className="h-6 w-6 text-foreground/70" />
          </div>
          <p className="text-foreground text-sm font-semibold">You're offline</p>
          <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
            Connect to the internet to stream this title — or download movies while
            online to watch them anytime, even offline.
          </p>
          <Link
            to="/my-downloads"
            className="mt-1 inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[11px] font-semibold text-primary-foreground bg-primary"
          >
            <CloudDownload className="h-3.5 w-3.5" /> Go to Downloads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div
        ref={containerRef}
        className="relative w-full aspect-video overflow-hidden bb-player-shell bg-background"
      >
        <iframe
          key={`${embedUrl}:${sandbox || "unrestricted"}`}
          src={embedUrl}
          sandbox={sandbox}
          title={title ? `Watch ${title}` : "BingBloom player"}
          className="absolute inset-0 w-full h-full border-0 bg-background"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="origin"
        />
      </div>

      {/* Toolbar: server switcher + quick actions */}
      <div className="flex items-center gap-1.5 px-2 py-3 bg-background border-t border-border/60 flex-nowrap overflow-x-auto scrollbar-hide">
        <div className="relative shrink-0">
          <label className="sr-only" htmlFor="bb-server-select">
            Server
          </label>
          <select
            id="bb-server-select"
            value={server}
            onChange={(e) => pickServer(e.target.value as ServerKey)}
            className="h-9 appearance-none rounded-md border border-border/60 bg-foreground/5 pl-3 pr-8 text-[12px] font-semibold text-foreground"
          >
            {SERVERS.map((s) => (
              <option key={s.id} value={s.id} className="bg-background text-foreground">
                {s.label}{supportsRedirectProtection(s.id) ? " (Protected)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/70" />
        </div>

        {supportsRedirectProtection(server) && (
          <button
            type="button"
            aria-pressed={redirectProtection}
            title="Blocks player popups and redirects. Changing this reloads the player."
            onClick={() => setRedirectProtection((enabled) => !enabled)}
            className={`h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold transition ${
              redirectProtection
                ? "bg-primary text-primary-foreground ring-1 ring-primary"
                : "bg-primary/15 text-primary ring-1 ring-primary/50 animate-pulse shadow-[0_0_14px_hsl(var(--primary)/0.7)]"
            }`}
          >
            {redirectProtection ? "Ads off ✓" : "Turn off ads"}
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5 flex-nowrap shrink-0">
          <PlayerIconButton label="Download" prominent onClick={() => setDownloadOpen(true)}>
            <Download className="h-4 w-4" />
          </PlayerIconButton>
          <PlayerIconButton label={isFullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </PlayerIconButton>
          <PlayerIconButton label="Share" onClick={shareLink}>
            <Share2 className="h-4 w-4" />
          </PlayerIconButton>
          <PlayerIconButton
            label={inList ? "Remove from watchlist" : "Add to watchlist"}
            selected={inList}
            onClick={toggleWatchlist}
          >
            {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </PlayerIconButton>
        </div>
      </div>

      {supportsRedirectProtection(server) && (
        <p className="px-3 pb-2 bg-background text-[10.5px] leading-snug text-muted-foreground">
          For no redirects, turn on "Turn off ads". If the video doesn't play, or you see a message about sandboxing, turn it off again so it works and you keep enjoying your show.
        </p>
      )}

      <div className="border-t border-border/60 md:hidden">
        <InlineAdRow count={4} />
      </div>

      <DownloadSourceSheet
        open={downloadOpen}
        onOpenChange={setDownloadOpen}
        type={type}
        tmdbId={tmdbId}
        title={title || "Untitled"}
        year={year}
        season={type === "tv" ? season : undefined}
        episode={type === "tv" ? episode : undefined}
        itemId={`${type}-${tmdbId}${type === "tv" ? `-s${season}-e${episode}` : ""}`}
        poster={poster}
        backdrop={backdrop}
      />
    </div>
  );
};

export default MoviePlayer;

/** Compact squared controls with visible desktop labels and mobile tooltips. */
const PlayerIconButton = ({
  label,
  onClick,
  children,
  prominent = false,
  selected = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  prominent?: boolean;
  selected?: boolean;
}) => (
  <Button
    type="button"
    variant={prominent ? "default" : "outline"}
    size="sm"
    title={label}
    aria-label={label}
    onClick={onClick}
    aria-pressed={label.includes("watchlist") ? selected : undefined}
    className={`h-9 min-w-9 px-2.5 rounded-md transition active:scale-95 ${selected ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20" : prominent ? "" : "border-border/60 bg-secondary/40 text-foreground hover:bg-secondary"}`}
  >
    {children}
    {label !== "Share" && <span className="hidden lg:inline text-xs">{label.includes("watchlist") ? selected ? "Saved" : "Watchlist" : label}</span>}
  </Button>
);
