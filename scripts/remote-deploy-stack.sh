#!/usr/bin/env sh
set -eu

REMOTE_DIR="${1:?missing REMOTE_DIR}"
STACK_NAME="${2:?missing STACK_NAME}"
RUNTIME_BASENAME="${3:-runtime_deploy_upload.env}"
RUNTIME_FILE="$REMOTE_DIR/$RUNTIME_BASENAME"

cleanup() {
  rm -f "$RUNTIME_FILE"
}
trap cleanup EXIT

chmod 600 "$RUNTIME_FILE" || true

while IFS='=' read -r key value; do
  [ -n "$key" ] || continue
  case "$key" in \#*) continue ;; esac

  key="$(printf '%s' "$key" | tr -d '\r')"
  value="$(printf '%s' "$value" | tr -d '\r')"
  key="${key#\'}"
  key="${key%\'}"
  key="${key#\"}"
  key="${key%\"}"
  value="${value#\'}"
  value="${value%\'}"
  value="${value#\"}"
  value="${value%\"}"

  [ -n "$key" ] || continue
  export "$key=$value"
done < "$RUNTIME_FILE"

export STACK_NAME
STACK_WAIT_TIMEOUT_SECONDS="${STACK_WAIT_TIMEOUT_SECONDS:-90}"
STACK_WAIT_INTERVAL_SECONDS="${STACK_WAIT_INTERVAL_SECONDS:-5}"

print_stack_services() {
  docker stack services "$STACK_NAME" --format '{{.Name}} {{.Replicas}}'
}

list_not_ready_services() {
  while IFS=' ' read -r service replicas; do
    [ -n "$service" ] || continue
    case "$replicas" in
      */*)
        current="${replicas%/*}"
        desired="${replicas#*/}"
        ;;
      *)
        current="$replicas"
        desired="$replicas"
        ;;
    esac

    [ -n "$current" ] || continue
    [ "$current" = "$desired" ] || printf '%s\n' "$service"
  done
}

print_service_diagnostics() {
  service="${1:?missing service name}"
  echo "[ERROR] diagnostics for $service"
  docker service inspect "$service" \
    --format '[INFO] update_state={{if .UpdateStatus}}{{.UpdateStatus.State}}{{else}}n/a{{end}} update_message={{if .UpdateStatus}}{{.UpdateStatus.Message}}{{else}}n/a{{end}}' \
    2>/dev/null || true
  echo "[INFO] docker service ps $service --no-trunc"
  docker service ps "$service" --no-trunc || true
  echo "[INFO] docker service logs $service --tail 200"
  docker service logs "$service" --tail 200 2>/dev/null || echo "[WARN] docker service logs unavailable for $service"
}

wait_for_stack_convergence() {
  max_tries=$(( (STACK_WAIT_TIMEOUT_SECONDS + STACK_WAIT_INTERVAL_SECONDS - 1) / STACK_WAIT_INTERVAL_SECONDS ))
  try=1

  while [ "$try" -le "$max_tries" ]; do
    services_snapshot="$(print_stack_services 2>/dev/null || true)"
    if [ -n "$services_snapshot" ]; then
      echo "$services_snapshot"
      not_ready="$(printf '%s\n' "$services_snapshot" | list_not_ready_services)"
      if [ -z "$not_ready" ]; then
        echo "[INFO] stack converged on try=$try"
        return 0
      fi
      echo "[WARN] stack not ready yet (try=$try/$max_tries): $(printf '%s' "$not_ready" | tr '\n' ' ')"
    else
      echo "[WARN] stack services not listed yet (try=$try/$max_tries)"
    fi

    [ "$try" -lt "$max_tries" ] || break
    sleep "$STACK_WAIT_INTERVAL_SECONDS"
    try=$((try + 1))
  done

  echo "[ERROR] stack did not converge within ${STACK_WAIT_TIMEOUT_SECONDS}s"
  echo "[INFO] final docker stack services snapshot"
  print_stack_services || true
  final_not_ready="$(print_stack_services 2>/dev/null | list_not_ready_services || true)"
  for service in $final_not_ready; do
    print_service_diagnostics "$service"
  done
  return 1
}

echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY" -u "$REGISTRY_USERNAME" --password-stdin
docker pull "$IMAGE"
docker stack deploy -c "$REMOTE_DIR/app-stack.yml" "$STACK_NAME" --with-registry-auth
print_stack_services
docker stack services "$STACK_NAME" --format '{{.Name}}' | grep -q "^${STACK_NAME}_"
wait_for_stack_convergence
SERVICE_IMAGE="$(docker service inspect "${STACK_NAME}_frontend" --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null || true)"
[ -n "$SERVICE_IMAGE" ]
echo "[INFO] deployed_service_image=$SERVICE_IMAGE"
echo "$SERVICE_IMAGE" | grep -F "$IMAGE" >/dev/null
