# Implementación — `vtc_home_placeholder` (id=3)

**Batch:** `vtc_home_placeholder`  
**Fecha:** 2026-06-18

## Resumen

Sustitución del placeholder mobile genérico de Home por el wrapper mínimo que renderiza `VtcPlaceholder` de `@softour/maas-vtc-micro-front-private`, con estilos del paquete en `main.ts` y claves i18n `vtcPlaceholder.*` en en/es.

## Cambios

| Área | Ficheros |
|------|----------|
| Home wrapper | `src/views/Home/Home.vue` — renderiza `VtcPlaceholder` (patrón Login.vue) |
| Estilos bootstrap | `src/main.ts` — import `@softour/maas-vtc-micro-front-private/style.css` |
| i18n | `src/locale/en.json`, `src/locale/es.json` — claves `vtcPlaceholder.*` |
| Limpieza | Eliminado `src/views/Home/Home.scss` |
| Tests | `src/views/Home/__tests__/Home.spec.ts`, `src/__tests__/main-vtc-styles.spec.ts` |

## Criterios de acceptance

- [x] `Home.vue` wrapper mínimo con `VtcPlaceholder` del paquete VTC
- [x] `main.ts` importa `@softour/maas-vtc-micro-front-private/style.css`
- [x] Claves `vtcPlaceholder.*` en en/es (textos coherentes con landing VTC coming-soon)
- [x] `Home.scss` eliminado
- [x] Test Home verifica render de `VtcPlaceholder` (mock del paquete VTC)
- [x] Test acotado verifica import de estilos VTC en `main.ts`

## Notas

- Mock de `@softour/maas-vtc-micro-front-private` en Home.spec sigue el patrón de Login.spec (componente stub con `data-testid`).
- Textos i18n inferidos de las keys usadas en el bundle `dist/index.js` del paquete VTC (landing premium / countdown / notify).

## Verificación (implementer)

| Comando | Resultado |
|---------|-----------|
| `npm run test -- --run src/views/Home/__tests__/Home.spec.ts src/__tests__/main-vtc-styles.spec.ts` | exit 0 — 2 ficheros / 2 tests |

**Paths:** `src/views/Home/__tests__/Home.spec.ts` `src/__tests__/main-vtc-styles.spec.ts`

**No ejecutado (gate del batch):** `npm run test` (suite completa), `npm run type-check`, `npx eslint --fix` (paths del lote; ver `batch` en feature_list).
