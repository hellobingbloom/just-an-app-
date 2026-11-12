import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { Search, X, Menu, Home, Film, Tv, Clapperboard, Radio, User, Bookmark, Heart, Settings, Shield, Download } from "lucide-react";

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zM12.05 20.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>
  </svg>
);
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const primaryNav = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/tv", label: "TV Shows", icon: Tv },
  { to: "/anime", label: "Anime", icon: Clapperboard },
  { to: "/live-tv", label: "Live TV", icon: Radio },
];

const drawerExtras = [
  { to: "/library", label: "Library", icon: Download },
  { to: "/my-list", label: "Watchlist", icon: Bookmark },
  { to: "/liked", label: "Liked", icon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/privacy", label: "Privacy", icon: Shield },
  { to: "/follow-us", label: "Follow Us", icon: Heart },
];

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-0 md:px-8 md:pt-3">
        <div className={`mx-auto flex h-12 max-w-[1480px] items-center gap-2 px-2 transition-all duration-300 md:h-14 md:gap-3 md:rounded-lg md:border md:px-4 ${scrolled ? "bg-background/95 border-border shadow-2xl backdrop-blur-xl" : "bg-background/80 border-border/70 backdrop-blur-xl"}`}>
          {/* Hamburger on the LEFT (mobile) */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="md:hidden grid place-items-center h-8 w-8 rounded-sm text-foreground/80 hover:text-primary flex-shrink-0"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <img
              src={"/logo-compact.png"}
              alt="BingBloom"
              className="h-7 w-7 md:h-8 md:w-8"
              style={{ filter: "drop-shadow(0 0 8px rgba(229,9,20,0.55))" }}
            />
            <span className="hidden sm:inline font-display text-xl text-foreground">BingBloom</span>
          </Link>

          {/* Desktop horizontal nav — centered */}
          <nav className="hidden md:flex items-center gap-1 mx-auto overflow-x-auto scrollbar-hide">
            {primaryNav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-sm text-[13px] font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-primary-foreground bg-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop search input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="hidden md:flex md:w-56"
          >
            <div className="flex w-full items-center rounded-sm border border-border bg-secondary/70 px-3 py-1.5 focus-within:border-primary">
              <Search className="mr-2 h-3.5 w-3.5 text-foreground/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent text-xs md:text-sm outline-none placeholder:text-foreground/50"
              />
            </div>
          </form>

          {/* Spacer for mobile to push right cluster */}
          <div className="flex-1 md:hidden" />

          {/* Right cluster — mobile: install, search, profile, settings (rightmost) */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              to="/download-app"
              className="md:hidden inline-flex items-center gap-1 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase text-primary-foreground"
              aria-label="Download BingBloom app"
            >
              <Download className="h-3 w-3" /> Download App
            </Link>
            <a
              href="https://whatsapp.com/channel/0029VbD2CdHEwEjtJ5Utbo2n"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden grid place-items-center h-7 w-7 rounded-sm bg-[#25D366]/15 text-[#25D366]"
              aria-label="Join BingBloom on WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
            </a>
            <Link
              to="/download-app"
              className="hidden md:inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary px-3 py-2 text-[12px] font-semibold text-foreground hover:border-primary"
              aria-label="Download BingBloom app on desktop"
            >
              <Download className="h-3.5 w-3.5" /> Download App
            </Link>
            <a
              href="https://whatsapp.com/channel/0029VbD2CdHEwEjtJ5Utbo2n"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:grid place-items-center h-8 w-8 rounded-sm bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25"
              aria-label="Join BingBloom on WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <Link
              to="/search"
              aria-label="Search"
              className="md:hidden grid place-items-center h-8 w-8 rounded-sm bg-secondary/70 text-foreground/80 hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Link
              to="/profile"
              aria-label="Profile"
              className="grid place-items-center h-8 w-8 rounded-sm bg-secondary/70 text-foreground/80 hover:text-primary"
            >
              <User className="h-4 w-4" />
            </Link>
            <Link
              to="/library"
              aria-label="Library"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[12px] font-semibold text-foreground/80 hover:text-foreground hover:bg-secondary/60"
            >
              <Download className="h-3.5 w-3.5" /> Library
            </Link>
            <div className="hidden md:block"><ThemeToggle /></div>
            <Link
              to="/settings"
              aria-label="Settings"
              className="md:hidden grid place-items-center h-8 w-8 rounded-sm bg-secondary/70 text-foreground/80 hover:text-primary"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>


      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 z-[70] w-[82%] max-w-[300px] bg-card shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-4 h-14 border-b border-border">
              <Link to="/home" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
                <img src={"/logo-compact.png"} alt="" className="w-8 h-8" style={{ filter: "drop-shadow(0 0 6px rgba(229,9,20,0.6))" }} />
                <span className="font-display text-xl text-foreground">BingBloom</span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center min-w-[40px] min-h-[40px] rounded-sm hover:bg-secondary"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-0.5">
              {primaryNav.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-medium min-h-[44px] ${
                      active ? "bg-primary/15 text-primary" : "text-foreground/80 hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {label}
                  </Link>
                );
              })}
              <div className="h-px bg-border my-2" />
              {drawerExtras.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-medium text-foreground/80 hover:bg-secondary min-h-[44px]"
                >
                  <Icon className="w-[18px] h-[18px]" /> {label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between px-3 py-2 rounded-lg">
                <span className="text-sm font-medium text-foreground/80">Theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default TopBar;
