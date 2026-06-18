# Capacitor — Mobile build and native workflow

This template ships a **minimal Capacitor 7** layer: web-first Vue SPA with optional
Android/iOS shells. Native projects (`android/`, `ios/`) are generated locally and
ignored by git.

## Two build outputs

| Command | Config | Output | Use |
|---------|--------|--------|-----|
| `npm run build` | `vite.config.ts` | `dist/` | npm library / standard SPA deploy |
| `npm run build:app` | `vite.app.config.ts` | `www/` | Capacitor mobile shell (`base: './'`) |

Do not change the default `build` script when adding mobile support. Capacitor reads
from `www/` (`webDir` in `capacitor.config.ts`).

## Sync native projects

After `build:app`, copy web assets into native projects:

```bash
npm run cap:sync
```

Convenience scripts:

```bash
npm run build:android   # build:app + cap sync android
npm run build:ios       # build:app + cap sync ios
```

First-time setup (local only, not versioned):

```bash
npm run build:app
npx cap add android
npx cap add ios
npm run cap:sync
```

## Android Studio / Xcode

1. Run `npm run build:app && npm run cap:sync`.
2. Open the native IDE:
   - Android: `npx cap open android`
   - iOS (macOS): `npx cap open ios`
3. Run on emulator or device from the IDE.

### Android emulator and dev server

The emulator cannot reach `localhost` on your host. Point the WebView or live-reload
URL at `http://10.0.2.2:<PORT>` (e.g. `http://10.0.2.2:5173` for Vite default). See
`.env.example`.

## OAuth / OIDC in WebView

- Router uses **hash history** (`createWebHashHistory`) — no change required for
  file:// or embedded WebView routing.
- Set `VITE_FRONTEND_REDIRECT_ORIGIN` to your custom URL scheme, e.g.
  `com.softour.maasfrontend://login`. Must match Android intent-filters and iOS URL
  types in the native project.
- On startup, `src/main.ts` calls `App.getLaunchUrl()` and listens to `appUrlOpen` for
  hot deep-link callbacks. URLs are validated against `VITE_FRONTEND_REDIRECT_ORIGIN`
  via `getRuntimeConfigValue`; matching URLs dispatch `maas:native-oauth-redirect` on
  `window` for auth modules to consume.

## Shared composables (native / web)

| Composable | Plugin | Notes |
|------------|--------|-------|
| `useNetworkStatus` | `@capacitor/network` | Web fallback: `navigator.onLine` |
| `useGeolocationPermission` | `@capacitor/geolocation` | Web fallback: `navigator.geolocation` |
| `useAppLifecycle` | `@capacitor/app` | Re-checks geolocation permissions on foreground |

Use `Capacitor.isNativePlatform()` before native APIs; use `Capacitor.getPlatform()`
only for Android vs iOS differences.

## Config reference

- `capacitor.config.ts` — `appId`, `appName`, `webDir: 'www'`, Android
  `adjustMarginsForEdgeToEdge: 'auto'`.
- Vitest mocks for Capacitor plugins live in `src/test-setup.ts`.
