import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "@fontsource-variable/work-sans";
import App from "./App.tsx";
import "./index.css";

// Google tag manager / analytics bootstrap for the site. The actual script tag
// is loaded in index.html so it is present before the app starts and works on
// static GitHub Pages hosting.
if (typeof window !== "undefined") {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
  window.gtag("js", new Date());
  window.gtag("config", "G-QQVV8S4JTF");
}

// Apply persisted theme before render to avoid flash
try {
  const theme = localStorage.getItem("theme");
  if (theme === "light") document.documentElement.classList.add("light");
  else document.documentElement.classList.remove("light");
} catch {}

const root = document.getElementById("root");
if (!root) throw new Error("Application root is missing");

createRoot(root).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
