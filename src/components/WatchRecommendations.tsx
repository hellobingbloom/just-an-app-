import { Link } from "react-router-dom";
import { img } from "@/lib/tmdb";

interface Recommendation {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

const WatchRecommendations = ({ items, type }: { items: Recommendation[]; type: "movie" | "tv" }) => (
  <aside className="hidden md:block min-w-0 pt-1" aria-label="Recommended titles">
    <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
      <h3 className="text-[13px] font-semibold text-foreground mb-2">Recommended</h3>
      <div className="space-y-3">
        {items.slice(0, 12).map((item) => (
          <Link
            key={item.id}
            to={type === "tv" ? `/watch/tv/${item.id}/1/1` : `/watch/movie/${item.id}`}
            className="grid grid-cols-[minmax(88px,1.15fr)_minmax(0,1fr)] gap-2 group"
          >
            <div className="relative aspect-video rounded-md overflow-hidden bg-muted border border-border">
              {(item.backdrop_path || item.poster_path) && (
                <img src={img(item.backdrop_path || item.poster_path, "w300")} alt={item.title || item.name || ""} loading="lazy" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] xl:text-[12px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary">{item.title || item.name}</p>
              <p className="text-[9px] xl:text-[10px] text-muted-foreground mt-1">
                {(item.release_date || item.first_air_date || "").slice(0, 4)}
                {item.vote_average ? ` · ★ ${item.vote_average.toFixed(1)}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </aside>
);

export default WatchRecommendations;