import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import InlineAdRow from "./InlineAdRow";
import ExternalSiteNotice from "./ExternalSiteNotice";



interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
}

const NO_END_AD = [
  "/my-downloads", "/profile", "/signin", "/welcome", "/onboarding",
  "/faq", "/investors", "/ways-to-watch", "/corporate", "/legal-notices",
  "/help", "/jobs", "/terms", "/contact", "/only-on-bingbloom",
  "/redeem", "/privacy", "/speed-test", "/ad-choices", "/media",
  "/gift-cards", "/cookie-preferences", "/legal-guarantee", "/follow-us",
  "/install", "/search", "/download-app",
];

const AppLayout = ({ children, hideNav, hideFooter }: AppLayoutProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  if (hideNav) return <>{children}</>;

  const showEndAd = !NO_END_AD.some((p) => pathname.startsWith(p));
  const FOOTER_ROUTES = ["/", "/home", "/settings"];
  const showFooter = !hideFooter && FOOTER_ROUTES.includes(pathname);

  const isLiveTv = pathname.startsWith("/live-tv");

  return (
    <div className="min-h-screen bg-bingbloom-app">
      <TopBar />
      <div className="pt-12 md:pt-[72px]" />
      <main className="pb-20 md:pb-0 w-full">
        {/* Non-blocking notices for sections that moved to our other apps.
            The pages stay fully usable. */}
        {isLiveTv && (
          <ExternalSiteNotice
            storageKey="live-tv"
            title="Live TV is now on OpenCast TV"
            description="More channels and better uptime on our dedicated live TV app."
            url="https://opencasttv.lovable.app"
            ctaLabel="Open OpenCast TV"
          />
        )}
        {children}
        {showEndAd && (
          <section aria-label="Advertisement" className="m-0 p-0 leading-none">
            <InlineAdRow count={4} />
          </section>
        )}
      </main>
      {showFooter && <Footer />}
      <BottomNav />
    </div>
  );
};


export default AppLayout;
