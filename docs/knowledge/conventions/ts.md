# Convenciones TypeScript y JavaScript (`src/`)

Referencia alineada con [eslint.config.js](../../../eslint.config.js) y [tsconfig.json](../../../tsconfig.json). Las reglas de plantilla y atributos en `.vue` se amplían en [vue.md](vue.md).

## Compilador TypeScript (`tsconfig.json`)

| Opción | Práctica |
|--------|----------|
| `strict` y flags estrictas asociadas | Tipado estricto; evitar trucos que silencien errores reales. |
| `noUnusedLocals` / `noUnusedParameters` | No dejar símbolos declarados sin uso; usar prefijo `_` si el nombre debe existir por firma o convención. |
| `noUncheckedIndexedAccess` | Accesos por índice pueden ser `T \| undefined`; comprobar o acotar antes de usar. |
| `noFallthroughCasesInSwitch` | Cada `case` debe terminar en `break`, `return`, `throw` o comentario de caída intencionada prohibida por el compilador. |
| `noImplicitAny` | No omitir tipos donde el compilador inferiría `any` indebido. |

## TypeScript solo en ficheros `.ts` / `.tsx`

Ficheros: `src/**/*.{ts,tsx}` salvo `src/__e2e__/**`.

| Origen | Reglas | Práctica |
|--------|--------|----------|
| `@typescript-eslint` | `recommended` + `recommended-requiring-type-checking` | Información de tipos en tiempo de lint; errores donde el tipo no garantiza seguridad. |
| `@typescript-eslint/no-explicit-any` | error | No usar `any`; acotar con tipos conocidos o genéricos. |
| `@typescript-eslint/no-unused-vars` | error, `argsIgnorePattern`/`varsIgnorePattern`: `^_` | Parámetros o variables “reservados” con nombre `_foo`. |
| `@typescript-eslint/explicit-function-return-type` | off | No se exige tipo de retorno explícito en todas las funciones. |
| `@typescript-eslint/explicit-module-boundary-types` | off | Igual en fronteras de módulo. |

## Excepciones por carpeta (ESLint)

**Ficheros de test TypeScript** — `src/**/__tests__/**/*.{ts,tsx}` y `src/**/*.spec.{ts,tsx}`:

- Todas las reglas `@typescript-eslint/no-unsafe-*` listadas en la config (acceso, asignación, llamada, retorno, argumentos) están **desactivadas** para facilitar mocks y datos parcialmente tipados.

**Tests y helpers de test** — `src/**/*.spec.*`, `src/**/__tests__/**`, `src/test/**`, `src/helpers/**`:

- `no-magic-numbers` desactivado.
- `no-restricted-imports` desactivado (imports relativos permitidos donde haga falta).
- `no-console` desactivado.
- `no-param-reassign` desactivado (p. ej. manipulación en tests).

**`src/core/**/*.ts`** — Consultas, DTOs y tipos complejos:

- Varias reglas `no-unsafe-*` y `no-redundant-type-constituents` desactivadas hasta tipar más a fondo.

**`src/store/**/*.ts`** — Estado Pinia:

- Misma relajación `no-unsafe-*` y `no-redundant-type-constituents` que en core.
- Estructura por store: `state/state.ts`, `actions/actions.ts`, `getter/getters.ts`, `index.ts` bajo `src/store/{storeName}/`; tests por slice en `state/__tests__/`, `actions/__tests__/`, `getter/__tests__/` (ver [conventions.md](../conventions.md) — sección Stores Pinia).

**`src/shared/composables/useOneSignalPermission/**/*.ts`** — API del plugin sin tipos completos:

- `no-unsafe-member-access` y `no-unsafe-call` desactivados.

**`src/__e2e__/**`** — Playwright / e2e:

- `project`: [tsconfig.e2e.json](../../../tsconfig.e2e.json).
- Globals de Node.
- `no-magic-numbers` y `no-console` desactivados.
- Solo `recommended` de TypeScript ESLint (no todo el bloque `recommended-requiring-type-checking` completo en el fragmento mostrado; las reglas base siguen aplicando según la config).

## Estilo y calidad en `src/**/*.{js,ts,vue}` (script)

En el `<script>` de un `.vue`, la indentación la gobierna `vue/script-indent` (4 espacios); la regla genérica `indent` está desactivada para `.vue` para evitar conflictos.

| Regla | Práctica |
|-------|----------|
| `@stylistic/no-tabs` | Solo espacios; nunca tabuladores. |
| `indent` (TS/JS) | 4 espacios; `SwitchCase`: 1 nivel extra en `case`. |
| `no-else-return` | Tras `return`, no usar `else` / `else if` redundante. |
| `curly` | Llaves obligatorias en todas las ramas (`if`, `else`, bucles…). |
| `camelcase` | Identificadores en camelCase; propiedades de objetos/API no forzadas; destructuring desde DTOs ignorado. |
| `no-magic-numbers` | warn; se ignoran −1, 0, 1, 2; índices de array; valores por defecto; exige `const` cuando aplique. |
| `eqeqeq` | Siempre `===` / `!==`. |
| `no-implicit-coercion` | No abusar de `!!`, `+foo`, `foo + ''` para coaccionar. |
| `no-nested-ternary` | No anidar operadores ternarios. |
| `no-unneeded-ternary` | No `cond ? true : false`; usar `cond`. |
| `prefer-template` | Preferir `` `${a}` `` frente a concatenación con `+`. |
| `object-shorthand` | `{ foo }` en lugar de `{ foo: foo }`. |
| `arrow-body-style` | Cuerpo de flecha mínimo (`as-needed`). |
| `prefer-const` | `const` si no se reasigna. |
| `no-var` | Usar `let` / `const`. |
| `no-param-reassign` | No reasignar parámetros; `props: false` permite mutar propiedades del objeto parámetro (con cuidado). |
| `no-console` | warn en producción. |
| `no-debugger` | error. |

## Imports (`eslint-plugin-import-x`)

| Regla | Práctica |
|-------|----------|
| `import-x/order` | Orden: `builtin` → `external` → `internal` → `parent` → `sibling` → `index`; **sin** líneas en blanco entre grupos. |
| `import-x/no-duplicates` | Un solo import por módulo (fusionar líneas). |
| `import-x/no-unresolved` | Rutas resolubles; resolver TypeScript con [tsconfig.eslint.json](../../../tsconfig.eslint.json) y alias `@/*`. |
| `import-x/named` | Los nombrados exportados deben existir en el módulo. |

**Vistas:** en `src/views/**/*.vue` no se permiten imports con patrón `../*`; usar el alias `@/` (ver [vue.md](vue.md)).

## Qué no cubre el lint (equipo)

Normas del [índice](../conventions.md) que ESLint/TS no aplican tal cual en todo el repo:

- Longitud máxima de línea (~100 caracteres) y comillas simples por defecto.
- Preferencia por mapas de manejadores frente a `switch` para lógica de negocio (el compilador sí evita `fallthrough` en `switch`).

Para reglas exactas y overrides futuros, inspeccionar la flat config en [eslint.config.js](../../../eslint.config.js).
