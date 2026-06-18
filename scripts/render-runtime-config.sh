#!/bin/sh
set -eu

OUT_FILE="/usr/share/nginx/html/runtime-config.js"

json_escape() {
  printf '%s' "${1:-}" |
    sed 's/\\/\\\\/g; s/"/\\"/g; s/\r//g' |
    awk 'BEGIN { first=1 } { if (!first) printf "\\n"; printf "%s", $0; first=0 }'
}

write_kv() {
  key="$1"
  value="$(json_escape "${2:-}")"
  printf '  "%s": "%s"' "$key" "$value"
}

{
  printf 'window.__MAAS_RUNTIME_CONFIG__ = {\n'
  write_kv "VITE_ENV" "${VITE_ENV:-production}"
  printf ',\n'
  write_kv "VITE_APP_BASE_URL" "${VITE_APP_BASE_URL:-}"
  printf ',\n'
  write_kv "VITE_API_BASE_URL" "${VITE_API_BASE_URL:-}"
  printf ',\n'
  write_kv "VITE_AUTH_API_BASE_URL" "${VITE_AUTH_API_BASE_URL:-}"
  printf ',\n'
  write_kv "VITE_FRONTEND_REDIRECT_ORIGIN" "${VITE_FRONTEND_REDIRECT_ORIGIN:-}"
  printf '\n};\n'
} > "$OUT_FILE"
