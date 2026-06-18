# Husky Pre-commit Hooks

## Descripción

Este proyecto utiliza [Husky](https://typicode.github.io/husky/) para ejecutar verificaciones automáticas antes de cada commit.

## Flujo del Pre-commit Hook

1. **ESLint Fixable Issues** (`eslint src/ --fix`)
   - Ejecuta ESLint y corrige automáticamente los problemas que se pueden auto-reparar
   - Detecta cambios realizados por ESLint

2. **Auto-commit de Cambios de Lint** (si hay cambios)
   - Si ESLint realizó cambios, éstos se agregan automáticamente al staging area
   - Se crea un commit automático con el mensaje: `chore: lint fixes [pre-commit]`

3. **Ejecución de Tests Unitarios** (`npx vitest run`)
   - Ejecuta todos los tests unitarios del proyecto
   - Si algún test falla, el commit se rechaza

4. **Ejecución de Tests E2E** (`npx playwright test`)
   - Ejecuta todos los tests end-to-end en modo headless
   - Prueba la aplicación en Chromium, Firefox y WebKit
   - Si algún test falla, el commit se rechaza

5. **Finalización**
   - Si todo pasa, el commit se permite
   - Si algo falla, el commit se rechaza y debes solucionar el problema antes de intentar de nuevo

## Comportamiento Esperado

### Caso 1: Cambios requieren lint fixes
```bash
$ git commit -m "feat: new feature"
🔍 Running ESLint...
✏️ ESLint fixed files. Auto-committing changes...
📝 Checking for ESLint changes...
✅ Running unit tests...
🎭 Running E2E tests...
✨ Pre-commit checks passed!
# Se crean 2 commits:
# 1. chore: lint fixes [pre-commit]
# 2. feat: new feature
```

### Caso 2: Sin cambios de lint, tests pasan
```bash
$ git commit -m "feat: new feature"
🔍 Running ESLint...
📝 Checking for ESLint changes...
✅ Running unit tests...
🎭 Running E2E tests...
✨ Pre-commit checks passed!
# Se crea 1 commit: feat: new feature
```

### Caso 3: Tests fallando
```bash
$ git commit -m "feat: new feature"
🔍 Running ESLint...
📝 Checking for ESLint changes...
✅ Running unit tests...
🎭 Running E2E tests...
# ❌ Tests fail
# Commit se rechaza
# Debes arreglar los tests y intentar de nuevo
```

## Instalación Manual

Si el hook no se ejecuta automáticamente, prueba:

```bash
# Reinstalar Husky
bun install

# Verificar que el hook existe y tiene permisos correctos
ls -la .husky/pre-commit
chmod +x .husky/pre-commit
```

## Desactivar Temporalmente (no recomendado)

Para skipear el hook en caso de emergencia:
```bash
git commit --no-verify -m "mensaje"
```
ts` y `.vue`)
- **ESLint rules**: Ver `eslint.config.js`
- **Unit tests**: Vitest (`vitest.config.js`)
- **E2E tests**: Playwright (`playwright.config.ts`) - Ejecuta en Chromium, Firefox y WebKit
- **lint-staged**: Configurado en `package.json` para ejecutar ESLint solo en archivos staged (archivos `.js` y `.vue`)
- **ESLint rules**: Ver `eslint.config.js`
- **Test runner**: Vitest (`vitest.config.js`)
