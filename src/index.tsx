import React from "react";
import { createRoot } from "react-dom/client";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";

import { App } from "./app";

// Your CLI template automatically handles mounting.
// Just render your app normally.

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element not found");
}

const root = createRoot(rootEl);

root.render(
  <AppUiProvider>
    <App />
  </AppUiProvider>
);
