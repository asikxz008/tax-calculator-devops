#!/usr/bin/env bash
# Requires a pre-existing Code Engine project and registry access secret.
# Never enable shell tracing here: authentication is supplied through the environment.
set -euo pipefail
: "${IBMCLOUD_API_KEY:?Set IBMCLOUD_API_KEY in the environment}"
: "${REGION:?Set REGION}"
: "${RESOURCE_GROUP:?Set RESOURCE_GROUP}"
: "${CE_PROJECT:?Set CE_PROJECT}"
: "${IMAGE:?Set IMAGE to a pushed registry image reference}"
APP_NAME="${APP_NAME:-tax-calculator}"
REGISTRY_SECRET="${REGISTRY_SECRET:-icr-pull}"
mkdir -p evidence/cloud
ibmcloud login --apikey "$IBMCLOUD_API_KEY" -r "$REGION" -g "$RESOURCE_GROUP" >/dev/null
if ! ibmcloud plugin show code-engine >/dev/null 2>&1; then
  ibmcloud plugin install code-engine -f
fi
ibmcloud ce project select --name "$CE_PROJECT"
if ibmcloud ce app get --name "$APP_NAME" >/dev/null 2>&1; then
  ibmcloud ce app update --name "$APP_NAME" --image "$IMAGE" \
    --registry-secret "$REGISTRY_SECRET" --port 8080 \
    --cpu 0.25 --memory 0.5G --min-scale 0 --max-scale 1 \
    --wait-timeout 600 2>&1 | tee evidence/cloud/deploy.txt
else
  ibmcloud ce app create --name "$APP_NAME" --image "$IMAGE" \
    --registry-secret "$REGISTRY_SECRET" --port 8080 \
    --cpu 0.25 --memory 0.5G --min-scale 0 --max-scale 1 \
    --wait-timeout 600 2>&1 | tee evidence/cloud/deploy.txt
fi
ibmcloud ce app get --name "$APP_NAME" 2>&1 | tee evidence/cloud/app-status.txt
ibmcloud ce app get --name "$APP_NAME" --output url | tee evidence/cloud/app-url.txt
APP_URL="$(cat evidence/cloud/app-url.txt)"
export APP_URL
node scripts/smoke.js | tee evidence/cloud/smoke.txt
