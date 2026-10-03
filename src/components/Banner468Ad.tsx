import { useEffect, useMemo, useRef, useState } from "react";

/**
 * BingBloom 468x60 leaderboard.
 *
 * Rendered inside an isolated `srcDoc` iframe so the global `atOptions` the
 * invoke script reads can never collide with other ad slots on the page.
 * On narrow screens the 468px unit is scaled down (never cropped) so it fits
 * a phone exactly, and the wrapper height shrinks with it so there is no gap.
 */
const AD_KEY = "4fa6ae27677820639437c70201ff0a93";
const AD_W = 468;
const AD_H = 60;

const SRC_DOC = `<!doctype html>
<html><head><meta charset="utf-8"/>
<style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;}</style>
</head><body>
<script type="text/javascript">
  atOptions = {
    'key' : '${AD_KEY}',
    'format' : 'iframe',
    'height' : ${AD_H},
    'width' : ${AD_W},
    'params' : {}
  };
<\/script>
<script src="https://bancadeltempoidea.org/22/${AD_KEY}"><\/script>
</body></html>`;

interface Props {
  className?: string;
  /** Show the small "Advertisement" caption. */
  label?: boolean;
}

const Banner468Ad = ({ className = "", label = true }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [armed, setArmed] = useState(false);
  const srcDoc = useMemo(() => SRC_DOC, []);

  // Fit the fixed-size creative to the available width.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth || AD_W;
      setScale(Math.min(1, w / AD_W));
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mount only when close to the viewport so it counts a real impression.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || armed) return;
    if (typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <div
      ref={wrapRef}
      role="complementary"
      aria-label="Advertisement"
      className={`w-full overflow-hidden ${className}`}
    >
      {label && (
        <span className="block text-center text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1">
          Advertisement
        </span>
      )}
      <div className="mx-auto" style={{ width: AD_W * scale, height: AD_H * scale }}>
        {armed && (
          <iframe
            title="Advertisement"
            srcDoc={srcDoc}
            scrolling="no"
            loading="lazy"
            width={AD_W}
            height={AD_H}
            className="block border-0"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          />
        )}
      </div>
    </div>
  );
};

export default Banner468Ad;
