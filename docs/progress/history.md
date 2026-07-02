# Historial de sesiones

## 2026-06-18 — `vtc_home_placeholder` (batch `vtc_home_placeholder`)

**Feature 3 — Home con VtcPlaceholder del paquete VTC** — `done`

### Entregables
- `Home.vue` wrapper mínimo con `VtcPlaceholder` de `@softour/maas-vtc-micro-front-private`
- `main.ts`: import `@softour/maas-vtc-micro-front-private/style.css`
- i18n `vtcPlaceholder.*` en `en.json` / `es.json`
- Eliminado `Home.scss` (placeholder mobile genérico + logout local)
- Tests: `Home.spec.ts`, `main-vtc-styles.spec.ts`

### Gate
- APPROVED — `docs/progress/features/2026-06-18/vtc_home_placeholder/gate_review.md`
- Suite completa (20 tests), type-check y ESLint acotado: exit 0

## 2026-06-18 — `users_auth_flow` (batch `users_auth_flow`)

**Feature 2 — Flujo login users + guard + home placeholder mobile** — `done`

### Entregables
- Vistas wrapper `Login.vue` y `AuthComplete.vue` (componentes `@softour/maas-users-micro-front-private`)
- Rutas `/`, `/auth/complete` (públicas), `/home` (`requiresAuth: true`) + `registerAuthGuard`
- `main.ts`: estilos users/global-front-components, plugin `GlobalFrontComponents`, OAuth Capacitor intacto
- i18n `home.dashboard.*` en `en.json` / `es.json`
- Home placeholder mobile-first (`Home.vue` + `Home.scss`) con logout vía `useLogin()`
- Deps directas: `axios`, `@heroicons/vue`, `@softour/global-front-components`
- 22 tests unitarios (rutas, guard, wrappers, main styles)

### Gate
- APPROVED (re-gate tras corrección ESLint) — `docs/progress/features/2026-06-18/users_auth_flow/gate_review.md`
- Suite completa, type-check y ESLint acotado: exit 0

## 2026-06-17 — `capacitor_integration` (batch `capacitor_integration`)

**Feature 1 — Integración Capacitor 7 (capa nativa mínima)** — `done`

### Entregables
- Capacitor 7 deps (`@capacitor/core`, `app`, `geolocation`, `network` + CLI/android/ios)
- `vite.app.config.ts` (build SPA → `www/`), scripts `build:app`, `cap:sync`, `build:android`, `build:ios`
- `capacitor.config.ts` (appId, webDir, edge-to-edge auto)
- Composables: `useNetworkStatus`, `useGeolocationPermission`, `useAppLifecycle` con cleanup
- OAuth deep links en `main.ts` (`App.getLaunchUrl`, `appUrlOpen`, `VITE_FRONTEND_REDIRECT_ORIGIN`)
- Mocks Vitest en `test-setup.ts`; 9 tests unitarios
- `docs/CAPACITOR.md`; nota emulador Android en `.env.example`
- `.gitignore`: `www/`, `android/`, `ios/`

### Gate
- APPROVED — `docs/progress/features/2026-06-17/capacitor_integration/gate_review.md`
- Suite completa, type-check y ESLint acotado: exit 0
