import Banner468Ad from "./Banner468Ad";

interface Props {
  className?: string;
  /** Hide on mobile. Defaults to false — this unit renders on both. */
  desktopOnly?: boolean;
}

const AdsterraIframeAd = ({ className = "", desktopOnly = false }: Props) => {
  return (
    <div
      role="complementary"
      aria-label="Sponsored"
      className={`${desktopOnly ? "hidden md:block" : ""} ${className}`}
    >
      <Banner468Ad />
    </div>
  );
};

export default AdsterraIframeAd;
