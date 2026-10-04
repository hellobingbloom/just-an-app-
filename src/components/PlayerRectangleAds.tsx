import { useEffect, useMemo, useRef, useState } from "react";

const AD_KEY = "7bdf2345688a935e14f4c7ff96269350";
const AD_WIDTH = 300;
const AD_HEIGHT = 250;

const SRC_DOC = `<!doctype html>
<html><head><meta charset="utf-8"/>
<style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;}</style>
</head><body>
<script>
  atOptions = {
    'key' : '${AD_KEY}',
    'format' : 'iframe',
    'height' : ${AD_HEIGHT},
    'width' : ${AD_WIDTH},
    'params' : {}
  };
<\/script>
<script src="https://bancadeltempoidea.org/22/${AD_KEY}"><\/script>
</body></html>`;

const PlayerRectangleAd = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [armed, setArmed] = useState(false);
  const srcDoc = useMemo(() => SRC_DOC, []);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;

    const measure = () => setScale(Math.min(1, element.clientWidth / AD_WIDTH));
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element || armed) return;

    if (typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [armed]);

  return (
    <div
      ref={wrapRef}
      role="complementary"
      aria-label="Sponsored"
      className="w-full overflow-hidden"
    >
      <div className="mx-auto" style={{ width: AD_WIDTH * scale, height: AD_HEIGHT * scale }}>
        {armed && (
          <iframe
            title="Sponsored"
            srcDoc={srcDoc}
            scrolling="no"
            loading="lazy"
            width={AD_WIDTH}
            height={AD_HEIGHT}
            className="block border-0"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          />
        )}
      </div>
    </div>
  );
};

export const PlayerAdRail = () => (
  <aside className="hidden lg:block min-w-0">
    <div className="sticky top-14">
      <span className="mb-2 block text-[9px] uppercase text-muted-foreground">Sponsored</span>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <PlayerRectangleAd key={index} />
        ))}
      </div>
    </div>
  </aside>
);

export const PlayerAdRow = () => (
  <div className="border-t border-border/60 px-2 py-2 lg:hidden">
    <span className="mb-1 block text-[9px] uppercase text-muted-foreground">Sponsored</span>
    <div className="grid grid-cols-4 gap-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <PlayerRectangleAd key={index} />
      ))}
    </div>
  </div>
);

export default PlayerRectangleAd;