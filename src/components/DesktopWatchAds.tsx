import Banner468Ad from "@/components/Banner468Ad";
import NativeAd from "@/components/NativeAd";

/** Four independent desktop placements, each with a display unit and a native. */
const DesktopWatchAds = () => (
  <aside className="hidden md:block min-w-0" aria-label="Desktop sponsored sections">
    <div className="space-y-4">
      {Array.from({ length: 4 }, (_, index) => (
        <section key={index} className="space-y-3" aria-label={`Sponsored section ${index + 1}`}>
          <p className="text-[9px] uppercase text-muted-foreground">Sponsored</p>
          <Banner468Ad format="rectangle" label={false} />
          <NativeAd inline height={88} desktopHeight={280} />
        </section>
      ))}
    </div>
  </aside>
);

export default DesktopWatchAds;