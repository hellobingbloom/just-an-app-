import NativeAd from "./NativeAd";

/**
 * 4-up grid of native ads. CTA buttons removed — the native ad creative
 * itself is the clickable target.
 */
const InlineAdRow = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="px-2 my-2">
      <span className="block text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1">
        Sponsored
      </span>
      <div className="grid grid-cols-4 gap-1 md:gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <NativeAd inline height={92} desktopHeight={280} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InlineAdRow;
