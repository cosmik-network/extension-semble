import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['tabs', 'storage'],
    host_permissions: ['https://api.semble.so/*'],
  },
});
