# Spec review — feature 1 — capacitor_integration

**Veredicto:** APPROVED

## Checkpoints (sin ejecutar npm)
- C3: [x] — Composables en `src/shared/composables/` sin store ni `core/services`; capas respetadas; sin `console.log` de debug en archivos del lote.
- C4: [x] — Tres composables nuevos con `__tests__/{nombre}.spec.ts` colocalizado (9 tests documentados en `impl.md`).
- C6: [x] — `impl.md` presente; esta `review_spec.md` cubre la revisión de spec del pipeline §2.3 antes del gate.

## Revisión de acceptance
- [x] Criterio 1 — `@capacitor/core`, `app`, `geolocation`, `network` en `dependencies`; `@capacitor/cli`, `android`, `ios` en `devDependencies`; scripts `build:app`, `cap:sync`, `build:android`, `build:ios` en `package.json` (líneas 9–12, 94–98).
- [x] Criterio 2 — `vite.app.config.ts`: `base: './'`, `outDir: 'www'`, `emptyOutDir: true`, alias `@` → `./src` (líneas 6–16).
- [x] Criterio 3 — `capacitor.config.ts`: `appId`, `appName`, `webDir: 'www'`, `android.adjustMarginsForEdgeToEdge: 'auto'` (líneas 4–9).
- [x] Criterio 4 — `.gitignore` incluye `www`, `android`, `ios` (líneas 14–16; equivalente a `www/`, `android/`, `ios/`).
- [x] Criterio 5 — Carpetas homónimas `useNetworkStatus/`, `useGeolocationPermission/`, `useAppLifecycle/` con `useX.ts` y `__tests__/`. Cleanup de listeners en `useNetworkStatus` (`onUnmounted` + `listenerHandle?.remove()` y `webCleanup`, líneas 34–37, 52–55) y `useAppLifecycle` (`onUnmounted` + `listenerHandle?.remove()`, líneas 35–37). `useGeolocationPermission` no registra listeners; no requiere cleanup.
- [x] Criterio 6 — `main.ts`: `setupNativeOAuthRedirects` con `Capacitor.isNativePlatform()`, `App.getLaunchUrl()`, `App.addListener('appUrlOpen', …)` y validación vía `getRuntimeConfigValue('VITE_FRONTEND_REDIRECT_ORIGIN')` en `handleNativeOAuthRedirect` (líneas 37–65, 79).
- [x] Criterio 7 — `src/test-setup.ts` mockea `@capacitor/core`, `@capacitor/network`, `@capacitor/geolocation`, `@capacitor/app`; referenciado en `vite.config.ts` `setupFiles`.
- [x] Criterio 8 — `docs/CAPACITOR.md` documenta `build` vs `build:app`, `cap:sync`, flujo IDE, OIDC/WebView y `VITE_FRONTEND_REDIRECT_ORIGIN`.
- [x] Criterio 9 — `.env.example` documenta `VITE_FRONTEND_REDIRECT_ORIGIN` y nota emulador `http://10.0.2.2:<PORT>` (líneas 7–10).

## impl.md (implementer)
- Tabla «Verificación (implementer)»: exit 0 documentado — sí (`npm run test -- --run` en 3 paths composables, 9 tests; `npm run build:app` exit 0).

## Notas (no bloqueantes)
- Tests usan prefijo `should` minúscula; `conventions.md` recomienda `Should` — alinear en futuro si el gate eslint no lo cubre.
- `useAppLifecycle` en web solo lee `document.hidden` al inicio; no suscribe `visibilitychange` (aceptable para scope mínimo; no exigido en acceptance).

## Cambios requeridos (si aplica)
Ninguno.
