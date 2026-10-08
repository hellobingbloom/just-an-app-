import { useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import { useMovieDetail, useTvDetail } from "@/hooks/useTmdb";

/** Full-screen embedded downloader (videodownloader.site) with a return button. */
const DownloadPage = () => {
  const { mediaType = "movie", id = "", s, e } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isTv = mediaType === "tv" || mediaType === "anime";
  const movie = useMovieDetail(!isTv ? id : undefined);
  const tv = useTvDetail(isTv ? id : undefined);
  const data: any = isTv ? tv.data : movie.data;

  const title = useMemo(() => {
    const q = params.get("title");
    if (q) return q;
    if (!data) return "";
    const base = isTv ? data.name : data.title;
    if (isTv && s && e) return `${base} S${String(s).padStart(2, "0")}E${String(e).padStart(2, "0")}`;
    return base || "";
  }, [data, params, isTv, s, e]);

  const src = `https://videodownloader.site/${title ? `?q=${encodeURIComponent(title)}` : ""}`;
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <SEO title={title ? `Download ${title} – BingBloom` : "Download – BingBloom"} description="Download movies and episodes on BingBloom." />
      <header className="flex items-center gap-3 px-3 h-12 shrink-0 border-b border-border bg-background">
        <button onClick={goBack} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
          <ArrowLeft className="w-4 h-4" /> Return to BingBloom
        </button>
        <span className="text-xs text-muted-foreground truncate">{title}</span>
      </header>
      <iframe
        key={src}
        src={src}
        title="Video downloader"
        className="flex-1 w-full border-0"
        allow="autoplay; fullscreen; clipboard-write"
        allowFullScreen
      />
    </div>
  );
};

export default DownloadPage;
