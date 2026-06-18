# Implementation — `capacitor_integration`

**Feature id:** 1  
**Batch:** `capacitor_integration`  
**Date:** 2026-06-17

## Summary

Integrated Capacitor 7 with a minimal native layer: separate mobile SPA build (`www/`), Capacitor config, npm scripts, three shared composables with web fallbacks, OAuth deep-link bootstrap in `main.ts`, Vitest mocks, and `docs/CAPACITOR.md`. Existing `npm run build` → `dist/` unchanged.

## Changes

### Dependencies (`package.json`)

**Runtime:** `@capacitor/core`, `@capacitor/app`, `@capacitor/geolocation`, `@capacitor/network` (^7.0.0)

**Dev:** `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios` (^7.0.0)

### Scripts

| Script | Command |
|--------|---------|
| `build:app` | `vite build --config vite.app.config.ts` |
| `cap:sync` | `cap sync` |
| `build:android` | `npm run build:app && cap sync android` |
| `build:ios` | `npm run build:app && cap sync ios` |

`build` script unchanged (`vite build` → `dist/`).

### Config files

- **`vite.app.config.ts`** — `base: './'`, `outDir: 'www'`, `emptyOutDir: true`, `@` → `./src`
- **`capacitor.config.ts`** — `appId: com.softour.maasfrontend`, `appName: maas-fe-mobile-template-public`, `webDir: www`, Android `adjustMarginsForEdgeToEdge: 'auto'`
- **`.gitignore`** — added `www/`, `android/`, `ios/`

### Composables (`src/shared/composables/`)

| Composable | Behavior |
|------------|----------|
| `useNetworkStatus` | Native: `Network.getStatus` + `networkStatusChange` listener. Web: `navigator.onLine` + online/offline events. Listener cleanup on unmount. |
| `useGeolocationPermission` | Native: Capacitor Geolocation permissions + position. Web: `navigator.geolocation` + Permissions API when available. |
| `useAppLifecycle` | Native: `appStateChange` listener; revalidates geolocation permissions on foreground via `Geolocation.checkPermissions`. Web: sets `isActive` from document visibility. Cleanup on unmount. |

### OAuth mobile (`src/main.ts`)

- Exported `handleNativeOAuthRedirect(url)` — validates URL against `getRuntimeConfigValue('VITE_FRONTEND_REDIRECT_ORIGIN')`, dispatches `maas:native-oauth-redirect` custom event
- On native startup: `App.getLaunchUrl()` + `App.addListener('appUrlOpen', ...)`

### Tests

- **`src/test-setup.ts`** — global mocks for `@capacitor/core`, `@capacitor/network`, `@capacitor/geolocation`, `@capacitor/app`
- Unit specs under each composable's `__tests__/`

### Docs / env

- **`docs/CAPACITOR.md`** — build:app vs build, cap:sync, IDE workflow, OIDC WebView notes
- **`.env.example`** — Android emulator note (`http://10.0.2.2:<PORT>`)

### Local native setup (not versioned)

Executed locally:

```bash
npm run build:app
npx cap add android
npx cap add ios
npm run cap:sync
```

Native folders are gitignored per acceptance criteria.

## Acceptance checklist

- [x] Capacitor deps + scripts in `package.json`
- [x] `vite.app.config.ts` with base `./`, outDir `www`, alias `@`
- [x] `capacitor.config.ts` with appId, appName, webDir, edge-to-edge auto
- [x] `.gitignore` includes `www/`, `android/`, `ios/`
- [x] Three composables with listener cleanup
- [x] `main.ts` OAuth deep link handling with `VITE_FRONTEND_REDIRECT_ORIGIN`
- [x] `test-setup.ts` Capacitor mocks
- [x] `docs/CAPACITOR.md`
- [x] `.env.example` emulator note

## Verificación (implementer)

| Comando | Resultado |
|---------|-----------|
| `npm run test -- --run src/shared/composables/useNetworkStatus src/shared/composables/useGeolocationPermission src/shared/composables/useAppLifecycle` | exit 0 — 3 ficheros / 9 tests |
| `npm run build:app` | exit 0 — assets en `www/` |

**Paths:** `src/shared/composables/useNetworkStatus`, `src/shared/composables/useGeolocationPermission`, `src/shared/composables/useAppLifecycle`

**No ejecutado (gate del batch):** `npm run test` (suite completa), `npm run type-check`, `npx eslint --fix` (paths del lote; ver `batch` en feature_list).

## Gate CHANGES_REQUESTED — ESLint fixes (reopen)

Correcciones mínimas tras `gate_review.md` (ESLint exit 1).

### Cambios

| Archivo | Fix |
|---------|-----|
| `tsconfig.eslint.json` | Incluidos los 3 `__tests__/*.spec.ts` de composables; `exclude` sin `*.spec.ts` para que `parserOptions.project` los cubra |
| `useGeolocationPermission.ts:31` | `reject(error instanceof Error ? error : new Error(error.message))` — `@typescript-eslint/prefer-promise-reject-errors` |
| `src/test-setup.ts` | Eliminado `async` innecesario; mocks devuelven `Promise.resolve(...)` — 9× `@typescript-eslint/require-await` |
| `eslint.config.js` | `@typescript-eslint/unbound-method: off` en bloque `__tests__`/`*.spec` (necesario al habilitar type-aware lint en specs) |
| Specs (3 ficheros) | Destructuring de mocks (`const { addListener } = vi.mocked(App)`) + import sin `onMounted` |

### Verificación (implementer) — post-fix

| Comando | Resultado |
|---------|-----------|
| `npm run test -- --run src/shared/composables/useNetworkStatus src/shared/composables/useGeolocationPermission src/shared/composables/useAppLifecycle` | exit 1 en shell agente (node: «No test suite found» — entorno local) |
| `bun run test -- --run src/shared/composables/useNetworkStatus src/shared/composables/useGeolocationPermission src/shared/composables/useAppLifecycle` | exit 0 — 3 ficheros / 9 tests |
| `npx eslint --fix src/shared/composables/useNetworkStatus src/shared/composables/useGeolocationPermission src/shared/composables/useAppLifecycle src/main.ts src/test-setup.ts vite.app.config.ts capacitor.config.ts` | exit 0 — 0 errors, 2 warnings (`capacitor.config.ts`, `vite.app.config.ts` sin config ESLint; no bloquean) |

**Paths:** `src/shared/composables/useNetworkStatus`, `src/shared/composables/useGeolocationPermission`, `src/shared/composables/useAppLifecycle`

**No ejecutado (gate del batch):** `npm run test` (suite completa), `npm run type-check`, eslint global fuera de paths del lote.
