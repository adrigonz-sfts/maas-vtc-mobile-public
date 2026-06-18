# AGENTS.md — maas-school-store-wrapper-front-public

> Punto de entrada para agentes de IA en este repositorio. Combina el **flujo de
> trabajo con features y subagentes** del proyecto con el **modelo SecDevOps**
> del template corporativo `maas-fe-template-public` (mismo baseline SecDevOps).
>
> Es un **mapa**: lee solo lo que necesites (divulgación progresiva). **No lo
> ignores a conveniencia.**
>
> Cursor carga además `.cursor/rules/agents-protocol.mdc` (`alwaysApply`): refuerza
> §2.2 (pipeline multi-agente), no lo sustituye.

---

## 1. Contexto del proyecto

Frontend público **school store wrapper**: micro-fronts `@softour/*`, Vue 3, Pinia,
Capacitor y publicación como **paquete npm**.

| Artefacto | Comando | Salida | Uso |
|-----------|---------|--------|-----|
| Librería | `npm run build` | `dist/` | Consumo npm / UMD+ES |
| SPA desplegable | `npm run build:app` | `www/` | Docker, Swarm, Capacitor |

Detalle operativo: [`docs/operacion.md`](docs/operacion.md). Infra y observabilidad:
[`docs/infra-o11y.md`](docs/infra-o11y.md).

### 1.1 Objetivo SecDevOps

1. CI/CD trunk-based con **Drone**.
2. **Build once, promote many** (`dev` → `staging` → `production`, mismo SHA).
3. Observabilidad mínima (logs y trazas hacia plataforma).
4. Seguridad mínima en pipeline y runtime.

### 1.2 Requisitos no negociables

1. **Sin secretos** en código, bundle, `.drone.yml` ni commits (tokens npm en
   Drone/Vault, no en repo).
2. Paquetes `@softour/*`: registry Verdaccio vía `.npmrc.example` (no versionar tokens).
3. Imagen de despliegue etiquetada por **`DRONE_COMMIT_SHA`**.
4. **Healthcheck y smoke** en cada entorno (`/health`, `/ready`).
5. Pipeline PR: lint, type-check, tests (`test:ci` con Bun), SAST (Sonar), SCA (Trivy).
6. Push `master`: build/push imagen, deploy `dev`, smoke.
7. Promote `staging`: mismo SHA, DAST (ZAP), smoke `/ready`.
8. Promote `production`: gate manual `QA_APPROVED=true`, deploy, smoke.
9. Exposición pública solo vía **Traefik** (`TRAEFIK_HOST` por entorno, desde Vault).
10. Secretos runtime **Vault-first** (`scripts/vault-fetch-runtime.sh`).

### 1.3 Artefactos obligatorios de plataforma

| Artefacto | Rol |
|-----------|-----|
| `.drone.yml` | CI/CD |
| `Dockerfile` | Imagen nginx (build SPA `www/`) |
| `deploy/swarm/app-stack.yml` | Stack Swarm |
| `deploy/nginx/default.conf` | Estáticos + `/health` + `/ready` |
| `scripts/vault-fetch-runtime.sh` | Runtime desde Vault |
| `docs/operacion.md` | Runbook |
| `docs/infra-o11y.md` | Contrato infra |

### 1.4 Contrato de endpoints (nginx)

| Ruta | Código | Significado |
|------|--------|-------------|
| `/health` | 200 | Liveness |
| `/ready` | 200 | Readiness (estáticos listos) |
| `/metrics` | — | Opcional en front puro; si no aplica, documentar en `infra-o11y.md` |

---

## 2. Trabajo con agentes (producto)

### 2.1 Antes de empezar

1. Lee [`docs/progress/current.md`](docs/progress/current.md).
2. Lee o crea [`docs/progress/feature_list.json`](docs/progress/feature_list.json)
   (plantilla: `feature_list_example.json`). **Una sola feature activa.**

### 2.2 Antes de tocar código (sin excepciones)

Antes de crear, borrar o modificar **`src/`**, **`tests/`**, **`e2e/`** o equivalentes:

1. Completar §2.1.
2. Tener **exactamente una** feature `in_progress` (menor `id` entre `pending`, salvo
   continuidad documentada en `current.md`).
3. Anotar en `current.md`: feature, inicio, plan breve (3–5 bullets).

Si el usuario pide un cambio sin mencionar features, **regístralo igual** en
`feature_list.json`.

**Excepción:** cambios que **solo** tocan `docs/`, `.cursor/` (reglas/docs),
`feature_list.json` / `current.md`, o **infra SecDevOps** (`.drone.yml`, `deploy/`,
`Dockerfile`, `scripts/` de plataforma) sin lógica de aplicación. Actualiza
`current.md` igualmente.

### 2.3 Pipeline multi-agente (código de producto)

Tras §2.2, todo cambio bajo `src/`, `tests/`, `e2e/` sigue [`.cursor/agents/`](.cursor/agents/):

| Rol | Responsabilidad |
|-----|-----------------|
| **leader** | Descompone, `batch`, `feature_list` / `current.md`; **no** implementa producto |
| **implementer** | Una feature, tests acotados, `impl.md`; **no** marca `done` |
| **spec_reviewer** | Arquitectura, convenciones, `acceptance` → `review_spec.md` (sin npm) |
| **reviewer** | Gate **por `batch`**: suite, type-check, eslint → `gate_review.md` |

**Estados:** `pending` → `in_progress` → `reviewed` (spec APPROVED) → `done` (gate APPROVED).

**`batch`:** mismo slug para todas las features de un epic (lote de 1: `batch` = `name`).

El agente principal **debe invocar** líder → implementer + spec_reviewer → reviewer (gate).
Prohibido implementar producto “a mano” saltando el líder o cerrar sin gate del lote.

Si no hay subagentes: **no modifiques** `src/` ni tests; bloqueo en `current.md` (§7).

`CURSOR.md` refuerza el rol leader en sesiones Cursor; no contradice este fichero.

---

## 3. Mapa del repositorio

| Ruta | Contenido | Cuándo leerlo |
|------|-----------|---------------|
| `docs/progress/feature_list.json` | Tareas y `batch` | Siempre al empezar |
| `docs/progress/current.md` | Sesión actual | Siempre al empezar |
| `docs/progress/history.md` | Bitácora cerrada | Contexto histórico |
| `docs/knowledge/architecture.md` | Arquitectura de capas | Antes de implementar |
| `docs/knowledge/conventions.md` | Estilo y estructura | Antes de escribir código |
| `docs/knowledge/verification.md` | Cómo verificar | Antes de marcar `done` |
| `docs/operacion.md` | Runbook local y Drone | Deploy, Vault, smoke |
| `docs/infra-o11y.md` | Contrato infra/o11y | Cambios de plataforma |
| `CHECKPOINTS.md` | Criterios de “hecho” | Auto-evaluación |
| `.cursor/agents/` | Definición de subagentes | Antes de `src/` / tests |
| `src/` | Aplicación | Implementación |
| `src/**/__tests__/**` | Tests unitarios | Verificación |
| `deploy/` | nginx + Swarm | Cambios de despliegue |

---

## 4. Reglas duras

- **Una feature a la vez.** No mezclar tareas en la misma sesión.
- **No marcar `done`** en features que tocaron `src/` sin gate **APPROVED** del `batch`.
- **Documentar** en `current.md` durante el trabajo, no solo al cerrar.
- **Repositorio limpio** al cerrar (§6).
- **Buscar en `docs/`** antes de inventar convenciones.
- **SecDevOps:** no saltarse smoke, Vault-first ni promoción por SHA.
- **Pipeline §2.3** para producto; sin atajos.

---

## 5. Cómo elegir una tarea

```
1. Abre docs/progress/feature_list.json
2. Filtra status == "pending"
3. Coge la de menor "id"
4. Cambia a "in_progress"
5. Anota en docs/progress/current.md: feature, hora, plan breve
```

---

## 6. Cierre de sesión

1. **Verificación:** si hubo cambios en `src/` y gate APPROVED del `batch`, no repitas
   `npm run test` al cerrar. Si no hubo gate: `npm run test`, `npm run type-check`,
   eslint acotado a paths tocados (ver `docs/knowledge/verification.md`). Solo docs/infra:
   no lances tests por norma.
2. Marca `done` en `feature_list.json` si corresponde.
3. Mueve resumen de `current.md` → `history.md` (append-only).
4. Vacía `current.md` (plantilla).
5. Sin `console.log` de debug ni TODOs huérfanos.

---

## 7. Si te bloqueas

- Relee la sección de `docs/` relevante.
- No inventes workarounds: anota el bloqueo en `current.md` y detén la sesión.

---

## 8. Jira y ramas

| Tipo Jira | Uso |
|-----------|-----|
| `Story` | Petición funcional externa (cliente/negocio) |
| `Task` | Trabajo técnico interno |

**Ramas:** `feature` | `bugfix` | `hotfix` | `techdev`

**Formato:** `<tipo>/<JIRA_KEY>-<slug>`

---

## 9. OpenAPI (si aplica)

Este frontend **no publica** `openapi.yaml` hoy. Si en el futuro se añade, aplicar
las reglas del template para APIM:

- `info` completo (`title`, `version`, `description`, `contact`, `license`).
- `tags` ordenados alfabéticamente por `name`.
- Cada operación: `summary`, `description`, `operationId` único, `tags` no vacío.
- Parámetros de path a nivel path con `description`.
- `/health`, `/ready`, `/metrics` con `security: []`.

---

## 10. Drone YAML hardening

Reglas al editar `.drone.yml` (evitar fallos de parseo en runners Linux):

1. Comandos con `:` inicial o `: ` (p. ej. headers HTTP) → comillas simples o bloque `|`.
2. No mezclar `key: value` sueltos en un ítem de `commands` sin comillas.
3. **Una sola responsabilidad para `SMOKE_URL`:** URL completa en `curl` *o* base + path, nunca ambas.
4. Ficheros temporales con secretos (`runtime.env`, `vault_runtime_*.env`, …): permisos restrictivos y borrado al final (incl. remoto).
5. Variables runtime de Vault: **no** `${...}` en YAML; usar `printenv` + `first_non_empty_env` en shell.
6. `runtime_deploy_*.env` con `jq` `tostring`; cargar remoto con `while IFS='=' read -r key value` (sin `source` directo).
7. Deploy remoto: script por **stdin** (`tr -d '\r' < script.sh | ssh ... "sh -s -- …"`).
8. Subir `app-stack.yml` / `runtime.env`: preferir `ssh … "cat > 'ruta'" < fichero` frente a `scp` con destino entrecomillado.
9. Redirecciones (`<`, `>`, `<<EOF`) solo dentro de bloque `|`.
10. Un bloque `|` por comando con redirección (evitar `\n` serializados que rompan el parser).
11. Mantener [`.gitattributes`](.gitattributes) con `*.sh` y `*.yml` en `eol=lf`.

Fallback de nombre de repo en scripts: `maas-school-store-wrapper-front-public` si falta
`DRONE_REPO_NAME`.
