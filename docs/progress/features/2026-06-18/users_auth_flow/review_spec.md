# Spec review — feature 2 — users_auth_flow

**Veredicto:** APPROVED

## Checkpoints (sin ejecutar npm)

- C3: [x] — Vistas wrapper finas en `src/views/{Login,AuthComplete,Home}/` sin IO ni reglas de negocio; `registerAuthGuard` y `useLogin` delegados al paquete `@softour/maas-users-micro-front-private`; sin `console.log` ni TODOs en `src/` tocado por el lote.
- C4: [x] — Tests colocalizados: `routes.spec.ts`, `auth-guard.spec.ts`, `main-vtc-styles.spec.ts` y `__tests__/` en Login, AuthComplete y Home (6 ficheros / 13 tests documentados en `impl.md`).
- C6: [x] — Evidencia de pipeline: `impl.md` (implementer) + este `review_spec.md` (spec_reviewer); gate pendiente en `reviewer.md` del batch.

## Revisión de acceptance

- [x] **Vistas wrapper Login y AuthComplete** — `src/views/Login/Login.vue` renderiza `<LoginView />`; `src/views/AuthComplete/AuthComplete.vue` renderiza `<AuthCompleteView />`; imports desde `@softour/maas-users-micro-front-private`. Tests en `Login.spec.ts` y `AuthComplete.spec.ts` mockean y asertan render del micro-front.
- [x] **Rutas públicas y protegida** — `src/routes.ts`: `/`, `/auth/complete` sin `requiresAuth`; `/home` con `meta: { requiresAuth: true }`. Cubierto en `routes.spec.ts`.
- [x] **`registerAuthGuard(router)`** — Invocado al final de `routes.ts` tras `createRouter`; import desde el paquete users. `auth-guard.spec.ts` ejercita redirección sin sesión, acceso con sesión y rutas públicas.
- [x] **`main.ts` estilos + plugin Softour** — Imports de `@softour/maas-users-micro-front-private/style.css` y `@softour/global-front-components/style.css`; `.use(GlobalFrontComponents)`. Verificado en código y `main-vtc-styles.spec.ts`.
- [x] **Claves i18n `home.dashboard.*` en en/es** — `src/locale/en.json` y `src/locale/es.json` definen `home.dashboard.loading`, `logIn`, `welcomeBack`, `welcomeBackLead` para consumo de LoginView del paquete vía i18n global.
- [x] **Home placeholder mobile** — `src/views/Home/Home.vue` con layout mobile-first (`100dvh`, safe-area), badge «Placeholder», título «Mobile Project», logout vía `useLogin().logout()`; estilos BEM en `Home.scss` colocalizado.
- [x] **Tests acotados de rutas, guard y vistas** — Unión de paths en `impl.md` coherente con acceptance; `customRenderer` usado en specs de vistas.

## Arquitectura y convenciones

- [x] Capas: vistas solo componen micro-fronts o UI placeholder; sin mappers, store ni `core/api` en el scope del lote.
- [x] Directorios homónimos (`Login/Login.vue`, etc.) con `__tests__/` junto al módulo (regla §7 `architecture.md`).
- [x] Vue 3 `<script setup>`, SCSS externo en Home (`src="./Home.scss"`), BEM en estilos.
- [x] Dependencias del lote en `package.json`: `axios`, `@heroicons/vue`, `@softour/global-front-components`, `@softour/maas-users-micro-front-private`.

## impl.md (implementer)

- Tabla «Verificación (implementer)»: exit 0 documentado — **sí** (`npm run test -- --run <paths>` — 6 ficheros / 13 tests).

## Cambios requeridos (si aplica)

_Ninguno._
