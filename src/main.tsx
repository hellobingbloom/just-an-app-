import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "@fontsource-variable/work-sans";
import App from "./App.tsx";
import "./index.css";

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
