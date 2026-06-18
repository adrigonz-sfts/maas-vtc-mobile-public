# Operacion Frontend (Template)

## 1) Arranque local

```bash
npm install
cp .env.example .env
npm run dev
```

Si el proyecto usa dependencias privadas `@softour/*`, preparar npm antes de instalar:

```bash
cp .npmrc.example .npmrc
npm adduser --registry https://npm.softoursistemas.com --auth-type=legacy
npm whoami --registry https://npm.softoursistemas.com
```

## 2) Build local

```bash
npm run build
npm run preview
```

## 3) Endpoints operativos en runtime container

1. `GET /health`: liveness frontend.
2. `GET /ready`: readiness frontend.
3. `GET /`: contenido de la app.
4. `GET /runtime-config.js`: configuracion runtime generada al arrancar nginx.

## 4) Flujo CI/CD

1. `push` a `master`:
   - build + push de imagen por SHA
   - deploy automatico en `dev`
2. Promote `staging`:
   - deploy del mismo SHA
   - DAST baseline
3. Promote `production`:
   - gate manual (`QA_APPROVED=true`)
   - deploy del mismo SHA

## 5) Virtual host y runtime (Vault-first)

1. Cada entorno debe inyectar `TRAEFIK_HOST`, `SMOKE_URL` y `SWARM_NETWORK` desde Vault:
   - `traefik_host` en `kv/softour/dev/<repo>/runtime`
   - `traefik_host` en `kv/softour/stg/<repo>/runtime`
   - `traefik_host` en `kv/softour/prod/<repo>/runtime`
2. Drone usa secretos runtime leidos por AppRole en Vault.
3. `from_secret` en Drone queda para bootstrap/plataforma.
4. `dev` y `stg` usan red Swarm `traefik`; `prod` usa red Swarm `softour`.
5. `dev` y `stg` usan dominios `softoursistemas.org`; `prod` usa `softoursistemas.com`.

Campos minimos en Vault:

```text
vite_env
traefik_host
swarm_network
smoke_url
auth_api_base_url
```

Plantilla de valores:

```bash
vault kv put kv/softour/dev/<repo>/runtime \
  vite_env="dev" \
  traefik_host="<app>-dev.softoursistemas.org" \
  swarm_network="traefik" \
  smoke_url="https://<app>-dev.softoursistemas.org" \
  app_public_url="https://<app>-dev.softoursistemas.org" \
  api_base_url="https://gw-dev.softoursistemas.com" \
  auth_api_base_url="https://gw-dev.softoursistemas.com/auth"

vault kv put kv/softour/stg/<repo>/runtime \
  vite_env="stg" \
  traefik_host="<app>-stg.softoursistemas.org" \
  swarm_network="traefik" \
  smoke_url="https://<app>-stg.softoursistemas.org" \
  app_public_url="https://<app>-stg.softoursistemas.org" \
  api_base_url="https://gw-stg.softoursistemas.com" \
  auth_api_base_url="https://gw-stg.softoursistemas.com/auth" \
  zap_target="https://<app>-stg.softoursistemas.org"

vault kv put kv/softour/prod/<repo>/runtime \
  vite_env="prod" \
  traefik_host="<app>.softoursistemas.com" \
  swarm_network="softour" \
  smoke_url="https://<app>.softoursistemas.com" \
  app_public_url="https://<app>.softoursistemas.com" \
  api_base_url="https://gw.softoursistemas.com" \
  auth_api_base_url="https://gw.softoursistemas.com/auth"
```

Checklist HAProxy/DNS antes del primer smoke:

1. Crear DNS del FQDN elegido.
2. Anadir `dev/stg` a `ops/haproxy/perimetral/modular/04-acls/test_swarm_domains.lst`.
3. Anadir `prod` a `ops/haproxy/perimetral/modular/04-acls/prod_swarm_domains.lst`.
4. Desplegar HAProxy perimetral antes de lanzar o relanzar el smoke.
5. Interpretar errores: `curl: (6)` es DNS/FQDN; `curl: (22) ... 503` es routing/backend/ACL.

## 6) Smoke checks

```bash
curl -fsS http://<host>/health
curl -fsS http://<host>/ready
curl -fsS http://<host>/runtime-config.js
curl -fsS http://<host>/ >/dev/null
```

## 7) Rollback

1. Identificar SHA estable anterior.
2. Promocionar ese build en Drone al entorno afectado.
3. Verificar estado de replicas:

```bash
docker stack services <stack_name>
```
