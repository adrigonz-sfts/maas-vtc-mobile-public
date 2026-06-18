# Convenciones SCSS, CSS y estilos en `.vue`

Referencia alineada con [.stylelintrc.json](../../../.stylelintrc.json). El proyecto extiende **`stylelint-config-standard-scss`**: hereda reglas del ecosistema “standard” (propiedades desconocidas acotadas, duplicados, integridad básica de sintaxis SCSS, etc.). Para el catálogo completo del preset, ver la documentación de [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss).

## Sintaxis por tipo de fichero

| Fichero | `customSyntax` |
|---------|----------------|
| `*.vue` | `scss` (bloques `<style>`). |
| `*.scss` | `postcss-scss`. |

Comandos: `npm run lint:styles` y `npm run lint:styles:fix` (ver [package.json](../../../package.json)).

## Patrones de nombre (personalizaciones del repo)

Todas las expresiones regulares están en [.stylelintrc.json](../../../.stylelintrc.json); resumen práctico:

| Qué | Patrón / regla | Práctica |
|-----|----------------|----------|
| Clases | `selector-class-pattern` | BEM flexible: bloque kebab-case, elemento `__`, modificadores `--`; ver mensaje en config. |
| IDs | `selector-id-pattern` | kebab-case (evitar IDs para maquetación; además véase `selector-max-id`). |
| Variables CSS (`--`) | `custom-property-pattern` | kebab-case. |
| Variables SCSS (`$`) | `scss/dollar-variable-pattern` | kebab-case. |
| Mixins | `scss/at-mixin-pattern` | kebab-case. |
| Funciones SCSS | `scss/at-function-pattern` | kebab-case. |
| Placeholders `%` | `scss/percent-placeholder-pattern` | kebab-case. |

## Límites y prohibiciones explícitos

| Regla | Valor | Práctica |
|-------|-------|----------|
| `selector-max-id` | `0` | No estilar por `#id`. |
| `selector-max-specificity` | `"0,4,0"` | Como mucho cuatro clases en la cadena de especificidad. |
| `declaration-no-important` | true | No usar `!important`. |
| `selector-no-qualifying-type` | true, `ignore`: attribute, class | Evitar `div.foo`; preferir `.foo` o selectores acotados sin tipo innecesario. |

## Pseudo-clases y Vue

| Regla | Detalle |
|-------|---------|
| `selector-pseudo-class-no-unknown` | Se ignoran `global` y `deep` (selectores con scope de Vue / legacy `::v-deep` según versión). |

## Notación de color e imports

| Regla | Valor | Práctica |
|-------|-------|----------|
| `color-function-notation` | `legacy` | Formato clásico tipo `rgb()`, `rgba()` según lo que exija el preset y consistencia del código existente. |
| `alpha-value-notation` | `number` | Transparencias como número donde aplique. |
| `import-notation` | `string` | `@import 'ruta'` con comillas cadena. |
| `no-descending-specificity` | `null` (desactivada) | Posibles avisos de especificidad descendente no bloquean; revisar igualmente en refactors grandes. |
