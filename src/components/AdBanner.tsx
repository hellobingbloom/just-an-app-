import Banner468Ad from "./Banner468Ad";

// 300x250 deliberately removed — heavy, intrusive format that hurts corporate look.
type AdFormat =
  | "banner-468x60"
  | "banner-728x90"
  | "banner-320x50"
  | "rect-160x300"
  | "sky-160x600";

interface AdBannerProps {
  format: AdFormat;
  className?: string;
  label?: boolean;
}

const AdBanner = ({ format: _format, className = "", label = true }: AdBannerProps) => (
  <Banner468Ad className={`my-4 ${className}`} label={label} />
);

export default AdBanner;
