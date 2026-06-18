# Convenciones de código

> Homogeneidad extrema. La IA predice mejor cuando el repositorio se parece
> a sí mismo en todas partes.

## Fuente de verdad y documentación por capa

No es necesario audir a los ficheros de configuracion.

El detalle regla por regla (y excepciones por carpeta) está en los anexos:

- [TypeScript y JavaScript en `src/`](conventions/ts.md) — `@typescript-eslint`, `import-x`, calidad de código en script, `tsconfig`.
- [Vue (SFC, plantilla y script)](conventions/vue.md) — `eslint-plugin-vue`, convenciones de template, reglas solo en `src/views`.
- [SCSS, CSS y estilos en `.vue`](conventions/scss.md) — Stylelint, BEM, límites de especificidad.

## Lint y comandos

| Comando | Qué hace |
|---------|----------|
| `npm run lint` | ESLint sobre `src/`. |
| `npm run lint:fix` | ESLint con corrección automática donde aplique. |
| `npm run lint:styles` | Stylelint sobre `src/**/*.{css,scss,vue}`. |
| `npm run lint:styles:fix` | Stylelint con `--fix`. |

En pre-commit, `lint-staged` ejecuta ESLint en `src/**/*.{ts,vue}` y Stylelint en `src/**/*.{css,scss}` y `src/**/*.vue`.

## Estilo Vue, TypeScript

- **Versión:** Vue 3 con `<script setup>` (Composition API).
- **Indentación:** 4 espacios (sin tabuladores); coherente con ESLint/`vue/script-indent`. Ver anexos.
- **Formato de línea:** objetivo máximo ~100 caracteres por línea (**convención de equipo**; no está aplicada por ESLint ni Prettier en este repo).
- **Imports:** al principio del fichero, orden definido por ESLint (`import-x/order`), sin líneas en blanco entre grupos. Destructuraciones en bloque cuando aplique.
- **Strings:** comillas simples `'...'`. Las dobles solo para escapar o cuando el formato lo imponga. **Convención de equipo** — ESLint no fuerza estilo de comillas aquí.
- Usar template literals para concatenar o interpolar cadenas (ESLint: `prefer-template`).
- Evitar números mágicos: usar constantes con nombre (`UPPER_SNAKE` cuando representen invariantes). ESLint marca `no-magic-numbers` en aviso salvo exclusiones configuradas (−1, 0, 1, 2, índices de array, valores por defecto y `const`).
- No encadenar `if` con `else` cuando el ramal sea solo otro `return` u homogéneo (ESLint: `no-else-return`).
- Evitar el uso innecesario de watch y watchEffect, normalmente si lo necesitamos lo pediremos.
- Evitar `switch` para ramificar lógica de negocio; preferir mapas de manejadores u objetos con `default`. El compilador exige `noFallthroughCasesInSwitch` si se usa `switch`. Para discriminar vistas, usar un objeto de manejadores, por ejemplo:

```ts
const handlers: Record<string, () => void> = {
    opcionA: () => {},
    opcionB: () => {},
    default: () => {},
};
const key = 'opcionA';
(handlers[key] ?? handlers.default)();
```

## Nombres

| Tipo                 | Convención    |
|----------------------|---------------|
| Clases, component files | `PascalCase`  |
| Funciones / variables| `camelCase`   |
| Constantes           | `UPPER_SNAKE` |
| Privadas (intención) | prefijo `_`   |
| Variables no usadas (ESLint/TS) | prefijo `_` en el nombre para ignorar avisos de no usado |

## Stores Pinia (`src/store/{storeName}/`)

Cada store vive en su propia carpeta bajo `src/store/` con **rebanadas** en subcarpetas y un barrel raíz:

```text
src/store/{storeName}/
  state/state.ts              — estado reactivo (p. ej. `ref` / `reactive`) y tipos propios del estado
  state/__tests__/state.spec.ts
  actions/actions.ts          — funciones que mutan el estado o orquestan efectos del store
  actions/__tests__/actions.spec.ts
  getter/getters.ts           — estado derivado (`computed`) u otras lecturas compuestas; si aún no hay derivados, el fichero sigue existiendo (placeholder mínimo coherente)
  getter/__tests__/getters.spec.ts
  index.ts                    — `defineStore`, ensambla state + actions + getters y exporta el composable (`use{Name}Store` y alias de equipo si aplica)
```

Cada rebanada lleva su propio `__tests__` junto al módulo (`{slice}/__tests__/{slice}.spec.ts` o nombre coherente con el fichero probado). Opcionalmente se puede añadir un spec de integración del barrel en `__tests__/` raíz del store o en `index/__tests__/`, si hace falta comprobar `defineStore` + Pinia.

Los consumidores importan el store desde el barrel `index.ts` (p. ej. `@/store/globalModal` o `@/store/globalModal/index`). Evitar un único `{name}Store.ts` suelto en la carpeta del store salvo migración temporal.

## Estructura de archivo

Cada componente Vue en `src/` puede seguir esta disposición lógica:

```text
Template
  HTML

Script
  imports
  composables / store / rutas
  variables reactivas
  computed / watchers (evitarlos)
  funciones / handlers
  lifecycles (onMounted, onUnmounted, …)

Styles
  lang="scss" scoped + src="./{NombreComponente}.scss" cuando el estilo viva fuera del SFC
```

## Tests

- Un archivo de test por vista, módulo, composable, util, etc.: `__tests__/{nombre}.spec.ts` (o `.spec.ts` junto al módulo, según convención del área).
- Mocks declarados de forma clara al inicio del archivo o bloque que los usa.
- No reutilizar el mismo árbol de render en cascada frágil en `beforeEach`/`afterEach` si oscurece el arrange de cada caso; preferir helpers explícitos.
- Usar el custom renderer en [`src/helpers/tests/customRenderer.ts`](../../src/helpers/tests/customRenderer.ts) y ampliarlo según necesidad.
- Nombres de test: prefijo `should` y descripción en **inglés**, p. ej. `Should add item on add button click`.

## Manejo de errores

- Llamadas a API y flujos de red: `try/catch` (o equivalente controlado) en capas adecuadas: `core/api`, `core/services`, acciones de `store`, según el diseño del módulo.

## Comentarios

Por defecto **no** se escriben. Solo se permiten cuando explican un *por qué*
no obvio (p. ej. workaround documentado, invariante sutil). Los nombres deben
hacer el resto.
