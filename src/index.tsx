import { createRoot } from "react-dom/client";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { prepareDesignEditor } from "@canva/intents/design";

import App from "./app";

prepareDesignEditor({
  render: async () => {
    const rootElement = document.getElementById("root");

    if (!rootElement) {
      throw new Error("Root element missing");
    }

    const root = createRoot(rootElement);

    root.render(
      <AppUiProvider>
        <App />
      </AppUiProvider>
    );
  },
});
