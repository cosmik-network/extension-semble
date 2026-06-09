import React from "react";
import ReactDOM from "react-dom/client";
import App from "../popup/App.tsx";
import { MantineProvider, v8CssVariablesResolver } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import "@mantine/core/styles.css";
import "../popup/App.css";
import { theme } from "../../styles/theme";
import { queryClient } from "../../lib/queryClient";
import { initApiKey } from "../../lib/semble";

// Same wrapper as the popup, but rendered into the side panel so the full UI can
// stay open alongside the page.
void initApiKey().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          theme={theme}
          defaultColorScheme="auto"
          cssVariablesResolver={v8CssVariablesResolver}
        >
          <App surface="sidepanel" />
        </MantineProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
