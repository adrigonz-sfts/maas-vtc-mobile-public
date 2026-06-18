---
name: release-from-master
description: >-
  Interactive git release workflow: stash (with untracked), checkout master, pull,
  apply stash, create branch, bump version, build, commit, npm publish, and push.
  Presents step choices each run. Use when the user asks release-from-master,
  publicar desde master, stash master pull release, or the full stash→master→publish flow.
disable-model-invocation: true
---

# release-from-master — flujo interactivo de release

Flujo para `@softour/maas-transport-micro-front-private`: partir de cambios locales, rebasar sobre `master` y opcionalmente publicar en npm.

**Regla:** al invocar esta skill, **siempre** preguntar qué pasos ejecutar (salvo que el usuario liste explícitamente los pasos deseados en el mismo mensaje). No ejecutar pasos no seleccionados.

Complementa [public-push](../public-push/SKILL.md) (solo bump + build + publish + commit + push sin git stash/master).

---

## Paso 0 — Selección (obligatorio)

Usar **AskQuestion** con `allow_multiple: true` para que el usuario elija pasos.

| id | Etiqueta | Comando / acción |
|----|----------|------------------|
| `stash` | Stash (incl. untracked) | `git stash push -u -m "<mensaje>"` |
| `master` | Ir a master | `git checkout master` |
| `pull` | Pull en master | `git pull origin master` |
| `apply-stash` | Aplicar stash | `git stash apply` (o `pop` si el usuario lo pide) |
| `branch` | Crear rama nueva | `git checkout -b <nombre>` |
| `cherry-pick` | Traer commits de la rama anterior | `git cherry-pick <hash>…` |
| `version` | Subir versión | `npm version <patch\|minor\|major> --no-git-tag-version` |
| `build` | Build | `npm run build` |
| `commit` | Commit | `git add` + `git commit` |
| `publish` | npm publish | `npm publish` |
| `push` | Push rama | `git push -u origin HEAD` |
| `drop-stash` | Eliminar stash aplicado | `git stash drop stash@{0}` |

Preguntas adicionales **solo si el paso correspondiente está seleccionado**:

1. **`branch`** → nombre de rama (texto libre en chat o AskQuestion si no lo dio).
2. **`cherry-pick`** → inspeccionar `git log master..<rama-anterior> --oneline`; confirmar hashes o “todos”.
3. **`version`** → patch / minor / major (AskQuestion single choice). Ver tabla semver en [public-push](../public-push/SKILL.md).
4. **`commit`** → ticket MAAS (`MAAS-XXX`) y resumen; usar plantilla de commit de public-push.
5. **`stash`** → mensaje del stash (default: `release wip`).

Mostrar al usuario un **resumen** de pasos elegidos y el orden antes de ejecutar. Pedir confirmación si falta nombre de rama, ticket o tipo de bump.

---

## Orden de ejecución

Ejecutar **solo** los pasos seleccionados, **en este orden** (omitir los no elegidos):

```
stash → master → pull → branch → cherry-pick → apply-stash → version → build → commit → publish → push → drop-stash
```

### Dependencias (avisar si faltan)

| Si eligió… | Requiere (recomendado) |
|------------|-------------------------|
| `apply-stash` | `stash` previo o stash existente en `git stash list` |
| `pull` | estar en `master` (`master`) |
| `branch` | estar en `master` actualizado (`master` + `pull`) |
| `cherry-pick` | rama creada o estar en rama destino |
| `build` | cambios listos; si hay `version`, ejecutar `version` antes |
| `publish` | `build` exitoso en la misma sesión |
| `push` | al menos un commit en la rama (`commit` o commits previos) |
| `drop-stash` | `apply-stash` OK y cambios ya commiteados (si hubo `commit`) |

Si el usuario omite un prerequisito, **preguntar** si añadir el paso o continuar bajo su responsabilidad.

---

## Comandos por paso

### 1. Stash

```bash
git stash push -u -m "release wip"
```

Guardar nombre de rama actual: `git branch --show-current` (útil para cherry-pick).

### 2. Master + pull

```bash
git checkout master
git pull origin master
```

Si la rama por defecto es `main`, usar `main` y `git pull origin main`.

### 3. Crear rama

```bash
git checkout -b feature/nombre-elegido
```

Desde `master` ya actualizado.

### 4. Cherry-pick (opcional)

Si la rama anterior tenía commits no incluidos en el stash:

```bash
git log master..feature/rama-anterior --oneline
git cherry-pick <hash1> <hash2>
```

Solo si el usuario seleccionó `cherry-pick`.

### 5. Aplicar stash

```bash
git stash apply
```

Ante conflictos: parar, informar archivos en conflicto, no continuar `commit`/`publish` hasta resolver.

### 6. Versión

```bash
npm version patch --no-git-tag-version   # o minor / major
```

Actualiza `package.json` y raíz de `package-lock.json`.

### 7. Build

```bash
npm run build
```

Exit code 0 obligatorio antes de `publish`.

### 8. Commit

```bash
git status
git diff
git log -3 --oneline
```

Stage solo archivos del release (no secretos). Commit:

```
MAAS-XXX: <resumen>.

- <bullet opcional>; bump to X.Y.Z.
```

No `--no-verify` salvo petición explícita.

### 9. Publish

```bash
npm publish
```

Solo `dist/` según `"files"`. Si 403/401: informar y no hacer `push` sin acuerdo.

### 10. Push

```bash
git push -u origin HEAD
```

No `git push --force` a `master`/`main`.

### 11. Drop stash

Tras `apply-stash` + `commit` exitosos:

```bash
git stash drop stash@{0}
```

Solo si el usuario seleccionó `drop-stash`.

---

## Estado inicial (siempre inspeccionar)

Antes del paso 0, ejecutar en paralelo:

```bash
git status
git branch --show-current
git stash list
git log -3 --oneline
```

Informar rama actual, cambios sin commit, stashes existentes y commits locales no en master.

---

## Ejemplo de invocación

Usuario: *「usa release-from-master」*

Agente:

1. Muestra estado git breve.
2. AskQuestion multi-select con los 12 pasos.
3. Pregunta rama / bump / ticket según selección.
4. Resume plan → ejecuta → reporta versión publicada, URL PR si aplica, stash restante.

Usuario: *「release-from-master: stash, master, pull, branch, apply-stash, version patch, build, commit, push」*

Agente: omite AskQuestion de pasos; pide solo lo que falte (nombre rama, ticket).

---

## Qué no hacer

- No ejecutar todos los pasos por defecto.
- No publicar sin build en la misma sesión (salvo OK explícito del usuario).
- No omitir bump si hay `publish`.
- No amend del commit anterior salvo reglas git del usuario.
- No tocar `git config`.

---

## Errores frecuentes

| Error | Acción |
|-------|--------|
| Stash vacío al apply | Listar `git stash list`; volver a rama anterior o abortar |
| Versión ya en npm | Subir patch/minor y repetir version + build + publish |
| Build falla en `vue-tsc` | Parar; no publish |
| Cherry-pick conflict | Resolver o `git cherry-pick --abort` y preguntar |
