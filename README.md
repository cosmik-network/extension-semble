# Semble Extension

Save links, notes, and connections to your [Semble](https://semble.so) collections directly from your browser.

Built with [WXT](https://wxt.dev) + React.

## Build instructions

These instructions reproduce the published build (also used for Firefox Add-ons source review).

### Requirements

- Node.js `24.x` (project developed on `v24.13.0`)
- pnpm `11.x` (project developed on `11.5.0`) — `corepack enable pnpm`

### Install dependencies

```sh
pnpm install
```

### Build

Chrome / Edge (Manifest V3):

```sh
pnpm build        # outputs to .output/chrome-mv3
pnpm zip          # produces .output/extension-semble-<version>-chrome.zip
```

Firefox (Manifest V2):

```sh
pnpm build:firefox   # outputs to .output/firefox-mv2
pnpm zip:firefox     # produces the extension zip + sources zip
```

### Development

```sh
pnpm dev             # Chrome
pnpm dev:firefox     # Firefox
```

## Tech stack

- [WXT](https://wxt.dev) — extension framework (build, manifest, zipping)
- React 19 + the React Compiler
- [Mantine](https://mantine.dev) — UI components
- [@semble.so/api](https://www.npmjs.com/package/@semble.so/api) — Semble API client
