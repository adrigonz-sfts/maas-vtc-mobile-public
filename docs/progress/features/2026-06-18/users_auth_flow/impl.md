# Implementación — `users_auth_flow` (id=2)

**Batch:** `users_auth_flow`  
**Fecha:** 2026-06-18

## Resumen

Integración del flujo de autenticación `@softour/maas-users-micro-front-private`: vistas wrapper, rutas públicas/protegidas, guard de sesión, estilos/plugin en `main.ts`, claves i18n para LoginView y home placeholder mobile-first.

## Cambios

| Área | Ficheros |
|------|----------|
| Vistas wrapper | `src/views/Login/Login.vue`, `src/views/AuthComplete/AuthComplete.vue` |
| Home placeholder | `src/views/Home/Home.vue`, `src/views/Home/Home.scss` |
| Rutas + guard | `src/routes.ts` (`/`, `/auth/complete`, `/home` con `requiresAuth`, `registerAuthGuard`) |
| Bootstrap | `src/main.ts` (CSS users + global-front-components, `GlobalFrontComponents`) |
| i18n | `src/locale/en.json`, `src/locale/es.json` (`home.dashboard.*`) |
| Deps | `package.json` — `axios`, `@heroicons/vue`, `@softour/global-front-components` |
| Tests | `src/__tests__/routes.spec.ts`, `auth-guard.spec.ts`, `main-vtc-styles.spec.ts`; specs en Login, AuthComplete, Home |

## Criterios de acceptance

- [x] Vistas wrapper Login y AuthComplete renderizan componentes del paquete users
- [x] Rutas `/`, `/auth/complete` (públicas) y `/home` (`meta.requiresAuth: true`)
- [x] `registerAuthGuard(router)` aplicado en `routes.ts`
- [x] `main.ts` importa estilos users + global-front-components y registra plugin Softour
- [x] Claves `home.dashboard.*` en en/es
- [x] `Home.vue` placeholder mobile con logout vía `useLogin().logout()`
- [x] Tests acotados de rutas, guard y vistas

## Notas

- Mocks de vistas users usan `importOriginal` para conservar `registerAuthGuard` al cargar `customRenderer` → `routes.ts`.
- Capacitor OAuth (`setupNativeOAuthRedirects`, `handleNativeOAuthRedirect`) sin cambios funcionales.

## Corrección post-gate (REJECTED — ESLint)

**Motivo:** gate `npx eslint --fix` exit 1 — `no-undef` en 6 specs (globals Vitest sin import) y `@typescript-eslint/no-unsafe-call` en `registerAuthGuard(router)` (`routes.ts:31`).

**Cambios (sin alterar comportamiento):**

| Fichero | Fix |
|---------|-----|
| 6 specs del batch | Imports explícitos desde `vitest` (`describe`, `it`, `expect`, `beforeEach`, `vi` según uso), alineado con `useAppLifecycle.spec.ts` |
| `src/routes.ts` | Wrapper tipado `applyAuthGuard = registerAuthGuard as (router: Router) => void` + `applyAuthGuard(router)` |
| `src/__tests__/routes.spec.ts` | Aserción de fuente actualizada (`registerAuthGuard` + `applyAuthGuard(router)`) |

## Verificación (implementer)

| Comando | Resultado |
|---------|-----------|
| `npm run test -- --run <paths>` | exit 0 — 6 ficheros / 13 tests |

**Paths:** `src/__tests__/routes.spec.ts` `src/__tests__/auth-guard.spec.ts` `src/__tests__/main-vtc-styles.spec.ts` `src/views/Login/__tests__/Login.spec.ts` `src/views/AuthComplete/__tests__/AuthComplete.spec.ts` `src/views/Home/__tests__/Home.spec.ts`

**No ejecutado (gate del batch):** `npm run test` (suite completa), `npm run type-check`, `npx eslint --fix` (paths del lote; ver `batch` en feature_list).
