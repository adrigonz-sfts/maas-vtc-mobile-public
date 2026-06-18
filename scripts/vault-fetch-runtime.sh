#!/bin/sh
set -eu

if [ "$#" -ne 3 ]; then
  echo "usage: $0 <dev|stg|prod> <project_name> <out_file>" >&2
  exit 2
fi

VAULT_ENV="$1"
PROJECT_NAME="$2"
OUT_FILE="$3"

env_or_empty() {
  printenv "$1" 2>/dev/null || true
}

first_non_empty() {
  for v in "$@"; do
    if [ -n "$v" ]; then
      printf '%s' "$v"
      return 0
    fi
  done
  return 1
}

print_len() {
  key="$1"
  val="$(env_or_empty "$key")"
  echo "[INFO] $key len=$(printf '%s' "$val" | wc -c)"
}

first_non_empty_key() {
  for key in "$@"; do
    val="$(env_or_empty "$key")"
    if [ -n "$val" ]; then
      printf '%s' "$key"
      return 0
    fi
  done
  return 1
}

print_aliases_if_debug() {
  debug="$(env_or_empty VAULT_DEBUG_ALIASES)"
  case "$debug" in
    1|true|TRUE|yes|YES)
      for key in "$@"; do
        print_len "$key"
      done
      ;;
    *)
      :
      ;;
  esac
}

apk add --no-cache curl jq >/dev/null

VAULT_BASE_RAW="$(first_non_empty "$(env_or_empty VAULT_ADDR)" "$(env_or_empty vault_addr)" || true)"
[ -n "$VAULT_BASE_RAW" ] || VAULT_BASE_RAW="https://vault.softoursistemas.com"
VAULT_BASE="$(printf '%s' "$VAULT_BASE_RAW" | tr -d '\r\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
case "$VAULT_BASE" in
  http://*|https://*) ;;
  *) VAULT_BASE="https://$VAULT_BASE" ;;
esac

case "$VAULT_ENV" in
  dev)
    ROLE_KEYS="vault_role_id_dev VAULT_ROLE_ID_DEV VAULT_ROLE_ID_DEV_REPO VAULT_ROLE_ID VAULT_ROLE_ID_DEV_UPPER VAULT_ROLE_ID_DEV_ALT VAULT_ROLE_ID_CANONICAL VAULT_ROLE_ID_REPO VAULT_ROLE_ID_GENERIC VAULT_ROLE_ID_UPPER VAULT_ROLE_ID_TYPO vault_role_id_dev_repo vault_role_id vault_role_ide_dev"
    SECRET_KEYS="vault_secret_id_dev VAULT_SECRET_ID_DEV VAULT_SECRET_ID_DEV_REPO VAULT_SECRET_ID VAULT_SECRET_ID_DEV_UPPER VAULT_SECRET_ID_DEV_ALT VAULT_SECRET_ID_CANONICAL VAULT_SECRET_ID_REPO VAULT_SECRET_ID_GENERIC VAULT_SECRET_ID_UPPER VAULT_SECRET_ID_TYPO vault_secret_id_dev_repo vault_secret_id vault_secret_ide_dev"
    ;;
  stg)
    ROLE_KEYS="vault_role_id_stg VAULT_ROLE_ID_STG VAULT_ROLE_ID_STG_REPO VAULT_ROLE_ID VAULT_ROLE_ID_STG_UPPER VAULT_ROLE_ID_CANONICAL VAULT_ROLE_ID_REPO VAULT_ROLE_ID_GENERIC VAULT_ROLE_ID_UPPER vault_role_id_stg_repo vault_role_id"
    SECRET_KEYS="vault_secret_id_stg VAULT_SECRET_ID_STG VAULT_SECRET_ID_STG_REPO VAULT_SECRET_ID VAULT_SECRET_ID_STG_UPPER VAULT_SECRET_ID_CANONICAL VAULT_SECRET_ID_REPO VAULT_SECRET_ID_GENERIC VAULT_SECRET_ID_UPPER vault_secret_id_stg_repo vault_secret_id"
    ;;
  prod)
    ROLE_KEYS="vault_role_id_prod VAULT_ROLE_ID_PROD VAULT_ROLE_ID_PROD_REPO VAULT_ROLE_ID VAULT_ROLE_ID_PROD_UPPER VAULT_ROLE_ID_CANONICAL VAULT_ROLE_ID_REPO VAULT_ROLE_ID_GENERIC VAULT_ROLE_ID_UPPER vault_role_id_prod_repo vault_role_id"
    SECRET_KEYS="vault_secret_id_prod VAULT_SECRET_ID_PROD VAULT_SECRET_ID_PROD_REPO VAULT_SECRET_ID VAULT_SECRET_ID_PROD_UPPER VAULT_SECRET_ID_CANONICAL VAULT_SECRET_ID_REPO VAULT_SECRET_ID_GENERIC VAULT_SECRET_ID_UPPER vault_secret_id_prod_repo vault_secret_id"
    ;;
  *)
    echo "[ERROR] unsupported vault env: $VAULT_ENV" >&2
    exit 2
    ;;
esac

ROLE_KEY="$(first_non_empty_key $ROLE_KEYS || true)"
SECRET_KEY="$(first_non_empty_key $SECRET_KEYS || true)"
ROLE_ID_RAW=""
SECRET_ID_RAW=""
[ -n "$ROLE_KEY" ] && ROLE_ID_RAW="$(env_or_empty "$ROLE_KEY")"
[ -n "$SECRET_KEY" ] && SECRET_ID_RAW="$(env_or_empty "$SECRET_KEY")"

ROLE_ID="$(printf '%s' "$ROLE_ID_RAW" | tr -d '\r\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
SECRET_ID="$(printf '%s' "$SECRET_ID_RAW" | tr -d '\r\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"

print_len VAULT_ADDR
[ -n "$ROLE_KEY" ] && print_len "$ROLE_KEY" || echo "[INFO] role alias selected: <none>"
[ -n "$SECRET_KEY" ] && print_len "$SECRET_KEY" || echo "[INFO] secret alias selected: <none>"
echo "[INFO] selected role key=${ROLE_KEY:-<none>} secret key=${SECRET_KEY:-<none>}"
print_aliases_if_debug $ROLE_KEYS $SECRET_KEYS

if [ -z "$ROLE_ID" ] || [ -z "$SECRET_ID" ]; then
  echo "[ERROR] missing vault approle bootstrap secrets in Drone."
  echo "[ERROR] expected one of env-scoped (dev/stg/prod), repo-scoped (_repo), or generic (vault_role_id/vault_secret_id) aliases."
  exit 1
fi

VAULT_HOST="$(printf '%s' "$VAULT_BASE" | sed -E 's#^https?://##; s#/.*$##')"
getent hosts "$VAULT_HOST" || true

LOGIN_PAYLOAD="$(jq -n --arg role "$ROLE_ID" --arg sid "$SECRET_ID" '{role_id:$role,secret_id:$sid}')"
LOGIN_RESPONSE="$(curl -sS --retry 3 --retry-delay 2 -w '\n%{http_code}' -X POST -H 'Content-Type: application/json' -d "$LOGIN_PAYLOAD" "$VAULT_BASE/v1/auth/approle/login")"
LOGIN_CODE="$(printf '%s' "$LOGIN_RESPONSE" | tail -n1)"
LOGIN_BODY="$(printf '%s' "$LOGIN_RESPONSE" | sed '$d')"
if [ "$LOGIN_CODE" != "200" ]; then
  echo "[ERROR] approle login failed (http=$LOGIN_CODE)"
  printf '%s\n' "$LOGIN_BODY"
  exit 1
fi

VAULT_TOKEN="$(printf '%s' "$LOGIN_BODY" | jq -r '.auth.client_token')"
test -n "$VAULT_TOKEN" && [ "$VAULT_TOKEN" != "null" ]

RUNTIME_PATH="kv/data/softour/$VAULT_ENV/$PROJECT_NAME/runtime"
SECRET_RESPONSE="$(curl -sS --retry 3 --retry-delay 2 -w '\n%{http_code}' -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_BASE/v1/$RUNTIME_PATH")"
SECRET_CODE="$(printf '%s' "$SECRET_RESPONSE" | tail -n1)"
SECRET_JSON="$(printf '%s' "$SECRET_RESPONSE" | sed '$d')"
if [ "$SECRET_CODE" != "200" ]; then
  echo "[ERROR] runtime fetch failed path=$RUNTIME_PATH (http=$SECRET_CODE)"
  printf '%s\n' "$SECRET_JSON"
  exit 1
fi

echo "$SECRET_JSON" | jq -e '.data.data | type == "object"'
echo "$SECRET_JSON" | jq -r '.data.data | to_entries[] | "\(.key)=\(.value|@sh)"' > "$OUT_FILE"
test -s "$OUT_FILE"
