# Spec review — feature 3 — vtc_home_placeholder

**Veredicto:** APPROVED

## Checkpoints (sin ejecutar npm)
- C3: [x] — `Home.vue` es wrapper mínimo en `views/` sin IO ni store; import directo del micro-front VTC, mismo patrón que `Login.vue`; sin `console.log` ni TODOs.
- C4: [x] — Tests acotados en `src/views/Home/__tests__/Home.spec.ts` (vista) y `src/__tests__/main-vtc-styles.spec.ts` (bootstrap estilos).
- C6: [x] — Pipeline documentado: `impl.md` + este `review_spec.md`.

## Revisión de acceptance
- [x] **`Home.vue` wrapper con `VtcPlaceholder`** — `src/views/Home/Home.vue` (L1–7): template `<VtcPlaceholder />`, import desde `@softour/maas-vtc-micro-front-private`; estructura idéntica a `Login.vue` (solo componente del paquete, sin lógica).
- [x] **Import estilos VTC en `main.ts`** — `src/main.ts` L9: `import '@softour/maas-vtc-micro-front-private/style.css';` junto a imports de otros micro-fronts.
- [x] **Claves `vtcPlaceholder.*` en en/es** — `src/locale/en.json` y `src/locale/es.json` (L13–56): bloque completo (`brand`, `nav`, `heroImageAlt`, `eyebrow`, `title`, `message`, `countdown`, `emailPlaceholder`, `notifyCta`, `subscribed`, `features`, `copyright`, `footer`) con textos coherentes coming-soon VTC en ambos idiomas.
- [x] **`Home.scss` eliminado** — directorio `src/views/Home/` contiene solo `Home.vue` y `__tests__/`; sin referencias a `Home.scss` en código fuente.
- [x] **Test Home — render `VtcPlaceholder`** — `src/views/Home/__tests__/Home.spec.ts`: mock parcial del paquete VTC (patrón `Login.spec.ts`), assert `data-testid="vtc-placeholder"` y texto stub.
- [x] **Test acotado import estilos en `main.ts`** — `src/__tests__/main-vtc-styles.spec.ts`: lectura de `main.ts` y `toContain('@softour/maas-vtc-micro-front-private/style.css')`.

## impl.md (implementer)
- Tabla «Verificación (implementer)»: exit 0 documentado — sí (`npm run test -- --run` en 2 ficheros / 2 tests).

## Cambios requeridos (si aplica)
_Ninguno._
