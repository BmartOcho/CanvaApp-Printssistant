import { AppI18nProvider } from "@canva/app-i18n-kit";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./app"; // Notice we use { App } for named export

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element not found");
}

const root = createRoot(rootEl);

root.render(
  <AppI18nProvider>
    <AppUiProvider>
      <App />
    </AppUiProvider>
  </AppI18nProvider>
);