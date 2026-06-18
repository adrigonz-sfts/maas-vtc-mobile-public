# infra-o11y.md - Requisitos de Infraestructura y Observabilidad del Frontend

## 1) Objetivo

Alinear este frontend con el modelo operativo de Softour:

1. despliegue con Drone + promociones por entorno.
2. logs estructurados y trazabilidad de peticiones.
3. metricas de plataforma en Prometheus/Grafana.
4. controles de seguridad en pipeline y runtime.

## 2) Requisitos no negociables

1. No secretos en codigo, bundle ni `.drone.yml`.
2. Build una vez y promocion del mismo SHA.
3. Endpoints operativos:
   - `/health`
   - `/ready`
4. Cabeceras de seguridad minimas en frontend/nginx.
5. Exposicion publica solo via HAProxy/Traefik.
6. Virtual host por entorno via `TRAEFIK_HOST`.
7. Modelo de secretos `Vault-first` (Vault origen, Drone consumidor).
8. `SWARM_NETWORK` por entorno: `traefik` para `dev/stg`, `softour` para `prod`.
9. Alta previa en HAProxy perimetral: `test_swarm_domains.lst` para `dev/stg`, `prod_swarm_domains.lst` para `prod`.

## 3) CI/CD minimo

PR:
1. lint
2. type-check
3. test
4. Trivy fs

Push master:
1. build y push de imagen SHA
2. deploy dev
3. smoke check

Promote staging:
1. deploy mismo SHA
2. ZAP baseline
3. smoke check

Promote production:
1. gate QA manual
2. deploy mismo SHA
3. smoke final

## 4) Diagnostico de primer despliegue

1. `curl: (6) Could not resolve host`: revisar `smoke_url`, DNS y sufijo del entorno.
2. `curl: (22) ... 503`: DNS resuelve; revisar ACL de HAProxy, despliegue de HAProxy y ruta Traefik.
3. Error de red externa Swarm: revisar `swarm_network` en Vault.
