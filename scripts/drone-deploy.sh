#!/bin/sh
set -eu

if [ "$#" -ne 4 ]; then
  echo "usage: $0 <remote_dir> <stack_name> <stack_file> <runtime_env_file>" >&2
  exit 2
fi

REMOTE_DIR="$1"
STACK_NAME="$2"
STACK_FILE="$3"
RUNTIME_ENV_FILE="$4"
RUNTIME_BASENAME="runtime_deploy_upload.env"

test -n "${SWARM_HOST:-}"
test -n "${SSH_USERNAME:-}"
test -n "${SSH_PASSWORD:-}"
test -f "$STACK_FILE"
test -f "$RUNTIME_ENV_FILE"

export SSHPASS="$SSH_PASSWORD"
SSH_TARGET="$(printf '%s' "$SSH_USERNAME@$SWARM_HOST" | tr -d '\r\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"

echo "[INFO] deploy target=$SSH_TARGET remote_dir=$REMOTE_DIR stack=$STACK_NAME"
sshpass -e ssh -o StrictHostKeyChecking=no "$SSH_TARGET" "mkdir -p '$REMOTE_DIR'"
sshpass -e scp -o StrictHostKeyChecking=no "$STACK_FILE" "$SSH_TARGET:$REMOTE_DIR/app-stack.yml"
cat "$RUNTIME_ENV_FILE" | sshpass -e ssh -o StrictHostKeyChecking=no "$SSH_TARGET" "cat > '$REMOTE_DIR/$RUNTIME_BASENAME'"
tr -d '\r' < scripts/remote-deploy-stack.sh | sshpass -e ssh -o StrictHostKeyChecking=no "$SSH_TARGET" sh -s -- "$REMOTE_DIR" "$STACK_NAME" "$RUNTIME_BASENAME"
