# LOGGING_STANDARD

## Objetivo
Unificar los logs de todos los servicios para facilitar soporte, observabilidad y seguridad.

## Formato obligatorio
- JSON en una sola linea por evento.
- UTC ISO-8601 con milisegundos.
- Niveles: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

## Campos obligatorios
| Campo | Tipo | Ejemplo |
|---|---|---|
| `timestamp` | string | `2026-02-17T10:15:22.123Z` |
| `level` | string | `INFO` |
| `message` | string | `Pedido creado` |
| `service.name` | string | `orders-api` |
| `service.version` | string | `1.12.3` |
| `service.environment` | string | `prod` |
| `host.name` | string | `sft-swarm2` |
| `event.dataset` | string | `application` |
| `trace.id` | string | `6f1f9f2244d549ca9f7d0d6af2acfa30` |
| `span.id` | string | `a9cd7737ef9a1b6f` |
| `transaction.id` | string | `req-3e7c71` |
| `correlation.id` | string | `order-20260217-44821` |

## Reglas de seguridad
- Nunca registrar: passwords, tokens, api-keys, connection strings, cookies.
- Enmascarar datos personales/sensibles.
- Evitar multilinea (stacktrace dentro de un campo).

## Evento minimo valido
```json
{
  "timestamp": "2026-02-17T10:15:22.123Z",
  "level": "INFO",
  "message": "Pedido creado",
  "service": {
    "name": "orders-api",
    "version": "1.12.3",
    "environment": "prod"
  },
  "host": {
    "name": "sft-swarm2"
  },
  "event": {
    "dataset": "application"
  },
  "trace": {
    "id": "6f1f9f2244d549ca9f7d0d6af2acfa30"
  },
  "span": {
    "id": "a9cd7737ef9a1b6f"
  },
  "transaction": {
    "id": "req-3e7c71"
  },
  "correlation": {
    "id": "order-20260217-44821"
  }
}
```

## Checklist rapido
- [ ] JSON en una linea.
- [ ] Campos obligatorios completos.
- [ ] `trace.id` y `correlation.id` propagados entre servicios.
- [ ] Sin secretos ni PII sin enmascarar.

## Snippets base
- Node.js (Pino): `docs/templates/logging/nodejs-pino-snippet.js`
- .NET (Serilog): `docs/templates/logging/dotnet-serilog-snippet.cs`
- Java (Logback JSON): `docs/templates/logging/java-logback-logstash-snippet.xml`
- Quality gate CI: `docs/templates/logging/LOGGING_POLICY_CI.md`

## Referencia interna
- `docs/04-operacion-seguridad/logging-normalizacion-dev.md`
