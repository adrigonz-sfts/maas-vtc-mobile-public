# SSR Scope Note

This template covers static SPA frontends built with Vite and served by NGINX.

Do not reuse these artifacts for Nuxt or Nitro SSR:

1. `Dockerfile`
2. `deploy/nginx/default.conf`
3. `deploy/swarm/app-stack.yml`

Nuxt or Nitro SSR needs:

1. A Node runtime instead of an NGINX static runtime.
2. `/health` and `/ready` served by the application.
3. Runtime public config injected after build.
4. A Swarm stack that maps runtime env to `NUXT_PUBLIC_*`.
