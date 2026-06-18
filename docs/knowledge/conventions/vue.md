# Convenciones Vue (SFC)

Referencia alineada con [eslint.config.js](../../../eslint.config.js). El comportamiento TypeScript dentro del `<script>` se describe aquí y en [ts.md](ts.md).

## Base: `eslint-plugin-vue` recomendado

El proyecto usa `pluginVue.configs['flat/recommended']`: hereda un conjunto amplio de reglas sobre orden de opciones API, seguridad en plantillas, `key` en listas, etc. 

Las reglas **adicionales** definidas en la config del repo (bloque producción `src/**/*.{js,ts,vue}`) son las siguientes salvo donde un `files` más específico las modifique.

## API de componentes

| Regla | Práctica |
|-------|----------|
| `vue/component-api-style` | Solo **`<script setup>`**; no Options API para componentes nuevos. |
| `vue/multi-word-component-names` | off — permitidos nombres de una sola palabra si el diseño lo requiere. |

## Plantilla: formato y atributos

| Regla | Práctica |
|-------|----------|
| `vue/html-indent` | 4 espacios en el template. |
| `vue/html-self-closing` | Elementos void (`<img>`, etc.): autocierre obligatorio; elementos HTML normales: **no** autocierre tipo `<div />`; componentes Vue: autocierre cuando no tengan contenido. |
| `vue/max-attributes-per-line` | Una atributo por línea en modo singleline y multiline. |
| `vue/first-attribute-linebreak` | Una sola línea: primer atributo junto al nombre del tag; multilínea: primer atributo en línea nueva. |
| `vue/attribute-hyphenation` | **never** — atributos en **camelCase** en plantilla (`:modelValue`, no `:model-value`). |
| `vue/v-on-event-hyphenation` | **never** — eventos como `@click` / nombres camelCase coherentes con la API expuesta (`@updateModelValue`, etc.); autofix disponible. |
| `vue/v-bind-style` | Forma corta `:` donde aplique. |
| `vue/v-on-style` | Forma corta `@` donde aplique. |
| `vue/prefer-true-attribute-shorthand` | Atributos booleanos verdaderos en forma corta cuando el estilo del proyecto lo use. |

## Seguridad y mantenimiento de plantilla

| Regla | Práctica |
|-------|----------|
| `vue/no-v-html` | No usar `v-html` salvo caso excepcional revisado (XSS). |
| `vue/no-unused-refs` | Eliminar refs declaradas que no se usan. |
| `vue/no-useless-v-bind` | No envolver valores constantes en `v-bind` innecesario. |

## TypeScript dentro de `.vue`

- Parser: `vue-eslint-parser` con `parserOptions.parser` apuntando a `@typescript-eslint/parser`.
- Solo se aplican las reglas de **`...tseslint.configs.recommended.rules`** en el bloque de ficheros `.vue`, **no** el mismo conjunto extendido **`recommended-requiring-type-checking`** que en los `.ts` sueltos. El script de un SFC tiene un subconjunto distinto de comprobaciones TypeScript ESLint que un fichero `.ts` en `src/`.
- Para tipos y `strict` del compilador, sigue aplicando `vue-tsc` / `tsconfig` al verificar el proyecto.

## Overrides solo en vistas

**`src/views/**/*.vue`**

| Regla | Práctica |
|-------|----------|
| `no-restricted-imports` | Patrón `../*`: preferir **`@/`** para subir desde la vista; evita rutas relativas frágiles tipo `../../../`. |

## Falsos positivos en `.vue`

| Regla | Motivo |
|-------|--------|
| `indent` | Desactivada en `.vue` para no chocar con `vue/script-indent`. |
| `no-useless-assignment` | Desactivada: variables definidas solo para la plantilla no siempre las ve el mismo análisis que el script aislado. |

## Estilos en componentes

Las reglas de SCSS/CSS en `<style lang="scss" scoped src="./{ComponentName}.scss">` las cubre Stylelint;
