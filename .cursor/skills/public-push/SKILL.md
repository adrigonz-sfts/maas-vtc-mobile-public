---
name: public-push
description: >-
  Bump package version, run build and npm publish, commit with MAAS ticket prefix,
  and push. Use when the user asks to release, publish the package, public-push,
  or ship a version to npm with git push.
disable-model-invocation: true
---

# public-push — release y push

Flujo para publicar `@softour/maas-transport-micro-front-private` y subir el commit.

Para el flujo completo con stash → master → pull → rama nueva (pasos elegibles), usar [release-from-master](../release-from-master/SKILL.md).

## Cuándo usar

- El usuario pide **publicar**, **release**, **subir versión**, **build + publish**, o invoca **public-push**.
- Hay cambios en `src/` listos y tests verdes (o el usuario acepta publicar igual).

## Convención de versión (semver)

| Cambio | Bump |
|--------|------|
| Breaking API / contrato del paquete | `major` |
| Features nuevas (vistas, exports, comportamiento) | `minor` |
| Solo fixes, copy, tests, docs sin API nueva | `patch` |

Actualizar **solo** `package.json` → `version` y la entrada raíz en `package-lock.json` (o `npm version <patch|minor|major> --no-git-tag-version`).

## Pasos (orden fijo)

1. **Versión:** elegir bump acorde a la tabla; sincronizar lockfile si hace falta.
2. **Build:** `npm run build` (incluye `build:types`). Debe terminar en exit 0.
3. **Publish:** `npm publish` desde la raíz (publica solo `dist/` según `"files"`). Requiere red y credenciales npm del registry del proyecto.
4. **Commit:** solo si el usuario lo pidió en el mismo mensaje.
   - Mensaje: `MAAS-XXX: <resumen breve en una o dos frases del porqué>`.
   - Incluir `package.json`, `package-lock.json`, código de la feature y docs de progreso si forman parte del release.
   - No usar `--no-verify` salvo petición explícita.
5. **Push:** `git push` (con `-u origin HEAD` si la rama no tiene upstream). Solo si el usuario lo pidió.

## Commit (plantilla)

```
MAAS-334: PlanificationMap create/edit line panels and secondary aside.

- Panels, filters, store line update merge, i18n; bump to 1.3.0.
```

Adaptar el cuerpo a los cambios reales; el prefijo `MAAS-XXX:` es obligatorio si el usuario lo indicó.

## Verificación antes de publish

- Preferible: `npm run test` y `npm run type-check` en verde si tocó `src/`.
- No commitear secretos (`.env`, tokens).

## Errores frecuentes

| Error | Acción |
|-------|--------|
| `npm publish` 403 / 401 | Registry/login; no forzar push del commit si publish falló sin acuerdo del usuario. |
| Build falla en `vue-tsc` | Arreglar tipos antes de publicar. |
| Versión ya publicada | Subir patch/minor y repetir build + publish. |

## Qué no hacer

- No `git push --force` a `main`/`master` sin petición explícita.
- No amend del commit anterior salvo reglas de git del usuario.
- No omitir bump de versión si se publica en npm.
