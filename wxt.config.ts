import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  vite: () => ({
    plugins: [babel({ presets: [reactCompilerPreset()] })],
  }),
  autoIcons: {
    baseIconPath: "assets/icon.svg",
  },
  manifest: {
    name: "Semble",
    description:
      "Save pages to your Semble library, organize them into collections, and create typed connections between them.",
    permissions: ["tabs", "storage", "contextMenus", "notifications"],
    host_permissions: ["https://api.semble.so/*"],
    browser_specific_settings: {
      gecko: {
        id: "semble@semble.so",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
});
