import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider, v8CssVariablesResolver } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import "@mantine/core/styles.css";
import { theme } from "../../styles/theme";
import { queryClient } from "../../lib/queryClient";
import { initApiKey } from "../../lib/semble";

// Load the stored API key before rendering so the first paint shows the
// right state (configured vs. not).
void initApiKey().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          theme={theme}
          cssVariablesResolver={v8CssVariablesResolver}
        >
          <App />
        </MantineProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
