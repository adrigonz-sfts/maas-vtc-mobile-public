#!/bin/sh
set -eu

if [ "$#" -lt 5 ] || [ "$#" -gt 6 ]; then
  echo "usage: $0 <dev|stg|prod> <vault_env_file> <runtime_output_file> <smoke_output_file> <stack_name> [zap_output_file]" >&2
  exit 2
fi

TARGET_ENV="$1"
VAULT_ENV_FILE="$2"
RUNTIME_OUTPUT_FILE="$3"
SMOKE_OUTPUT_FILE="$4"
STACK_NAME="$5"
ZAP_OUTPUT_FILE="${6:-}"

test -f "$VAULT_ENV_FILE"

set -a
. "$VAULT_ENV_FILE"
set +a

first_non_empty_env() {
  for key in "$@"; do
    val="$(printenv "$key" 2>/dev/null || true)"
    if [ -n "$val" ]; then
      printf '%s' "$val"
      return 0
    fi
  done
  return 1
}

require_non_empty() {
  key="$1"
  value="$2"
  if [ -z "$value" ]; then
    echo "[ERROR] missing required runtime value: $key" >&2
    exit 1
  fi
}

normalize_url() {
  printf '%s' "$1" | sed 's/[[:space:]]*$//; s#/*$##'
}

TRAEFIK_HOST="$(first_non_empty_env TRAEFIK_HOST traefik_host || true)"
SWARM_NETWORK="$(first_non_empty_env SWARM_NETWORK TRAEFIK_NETWORK DOCKER_NETWORK swarm_network traefik_network docker_network || true)"
VITE_ENV="$(first_non_empty_env VITE_ENV vite_env || true)"
VITE_APP_BASE_URL="$(first_non_empty_env VITE_APP_BASE_URL APP_BASE_URL app_base_url app_public_url || true)"
VITE_API_BASE_URL="$(first_non_empty_env VITE_API_BASE_URL API_BASE_URL api_base_url || true)"
VITE_AUTH_API_BASE_URL="$(first_non_empty_env VITE_AUTH_API_BASE_URL AUTH_API_BASE_URL auth_api_base_url maas_auth_api_public_url || true)"
VITE_FRONTEND_REDIRECT_ORIGIN="$(first_non_empty_env VITE_FRONTEND_REDIRECT_ORIGIN FRONTEND_REDIRECT_ORIGIN frontend_redirect_origin || true)"

case "$TARGET_ENV" in
  dev)
    SMOKE_URL="$(first_non_empty_env SMOKE_URL dev_smoke_url smoke_url app_public_url || true)"
    DEFAULT_SWARM_NETWORK="traefik"
    SMOKE_ENDPOINT="/health"
    ;;
  stg)
    SMOKE_URL="$(first_non_empty_env SMOKE_URL stg_smoke_url smoke_url app_public_url || true)"
    ZAP_TARGET="$(first_non_empty_env ZAP_TARGET zap_target_stg zap_target || true)"
    DEFAULT_SWARM_NETWORK="traefik"
    SMOKE_ENDPOINT="/ready"
    ;;
  prod)
    SMOKE_URL="$(first_non_empty_env SMOKE_URL prod_smoke_url smoke_url app_public_url || true)"
    DEFAULT_SWARM_NETWORK="softour"
    SMOKE_ENDPOINT="/health"
    ;;
  *)
    echo "[ERROR] unsupported target env: $TARGET_ENV" >&2
    exit 2
    ;;
esac

[ -n "$VITE_ENV" ] || VITE_ENV="$TARGET_ENV"
[ -n "$SWARM_NETWORK" ] || SWARM_NETWORK="$DEFAULT_SWARM_NETWORK"
SMOKE_URL="$(normalize_url "$SMOKE_URL")"

require_non_empty TRAEFIK_HOST "$TRAEFIK_HOST"
require_non_empty SWARM_NETWORK "$SWARM_NETWORK"
require_non_empty SMOKE_URL "$SMOKE_URL"
require_non_empty VITE_AUTH_API_BASE_URL "$VITE_AUTH_API_BASE_URL"
require_non_empty IMAGE_REPO "${IMAGE_REPO:-}"
require_non_empty COMMIT_SHA "${COMMIT_SHA:-}"
require_non_empty REGISTRY "${REGISTRY:-}"
require_non_empty REGISTRY_USERNAME "${REGISTRY_USERNAME:-}"
require_non_empty REGISTRY_PASSWORD "${REGISTRY_PASSWORD:-}"

IMAGE="${IMAGE_REPO}:${COMMIT_SHA}"

jq -r -n \
  --arg IMAGE "$IMAGE" \
  --arg TRAEFIK_HOST "$TRAEFIK_HOST" \
  --arg SWARM_NETWORK "$SWARM_NETWORK" \
  --arg VITE_ENV "$VITE_ENV" \
  --arg VITE_APP_BASE_URL "$VITE_APP_BASE_URL" \
  --arg VITE_API_BASE_URL "$VITE_API_BASE_URL" \
  --arg VITE_AUTH_API_BASE_URL "$VITE_AUTH_API_BASE_URL" \
  --arg VITE_FRONTEND_REDIRECT_ORIGIN "$VITE_FRONTEND_REDIRECT_ORIGIN" \
  --arg REGISTRY "$REGISTRY" \
  --arg REGISTRY_USERNAME "$REGISTRY_USERNAME" \
  --arg REGISTRY_PASSWORD "$REGISTRY_PASSWORD" \
  '{
    IMAGE:$IMAGE,
    TRAEFIK_HOST:$TRAEFIK_HOST,
    SWARM_NETWORK:$SWARM_NETWORK,
    VITE_ENV:$VITE_ENV,
    VITE_APP_BASE_URL:$VITE_APP_BASE_URL,
    VITE_API_BASE_URL:$VITE_API_BASE_URL,
    VITE_AUTH_API_BASE_URL:$VITE_AUTH_API_BASE_URL,
    VITE_FRONTEND_REDIRECT_ORIGIN:$VITE_FRONTEND_REDIRECT_ORIGIN,
    REGISTRY:$REGISTRY,
    REGISTRY_USERNAME:$REGISTRY_USERNAME,
    REGISTRY_PASSWORD:$REGISTRY_PASSWORD
  } | to_entries[] | "\(.key)=\(.value|tostring)"' > "$RUNTIME_OUTPUT_FILE"

printf '%s' "$SMOKE_URL$SMOKE_ENDPOINT" > "$SMOKE_OUTPUT_FILE"

if [ "$TARGET_ENV" = "stg" ]; then
  require_non_empty ZAP_TARGET "$ZAP_TARGET"
  require_non_empty ZAP_OUTPUT_FILE "$ZAP_OUTPUT_FILE"
  printf '%s' "$ZAP_TARGET" > "$ZAP_OUTPUT_FILE"
fi
