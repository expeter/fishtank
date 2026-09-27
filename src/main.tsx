import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/fraunces/latin-400.css";
import "@fontsource/fraunces/latin-500.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./game-shell.css";
createRoot(document.getElementById("root")!).render(<App />);
if ("serviceWorker" in navigator && import.meta.env.PROD)
  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .catch(() => {});
  });

import "./living-cove.css";

import "./playroom.css";

import "./attention.css";

import "./welcome.css";

import "./quiet-ui.css";

import "./mobile-workbench.css";

import "./button-labels.css";

import "./fish-colours.css";
