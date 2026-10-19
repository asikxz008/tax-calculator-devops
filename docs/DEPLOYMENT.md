# IBM Cloud and Tekton runbook

These steps are for a Linux shell in the learner's authorized lab or workstation. Actual execution evidence is recorded in SUBMISSION.md.

## Skills Network lab profile

The course provides the IBM Cloud resources; no separate personal IBM Cloud registration or bank card is needed. In the Cloud IDE, open Cloud > Code Engine > Create Project, then Code Engine CLI. Use an ordinary terminal for Tekton in the OpenShift learner namespace and the Code Engine CLI terminal for deploying the resulting image.

The lab profile uses the existing `git-clone` and `buildah` ClusterTasks, the `pipeline` ServiceAccount and the `docker-reg-creds` Secret. The npm and Jasmine steps run as UID 65532 to match the cloned workspace. The workspace PVC explicitly selects `skills-network-learner`; the default IBM block storage class has no learner quota. Leave the pod's `fsGroup` unset so OpenShift can apply the appropriate security context for each task, including Buildah.

```bash
kubectl apply -f .tekton/lab/tasks.yaml
kubectl apply -f .tekton/lab/pipeline.yaml
kubectl create -f .tekton/lab/run.yaml
```

For reproducible execution, replace the run's `revision: main` parameter value with the intended full commit SHA before submitting it. The submitted run and its resolved commit are retained with the evidence.

Code Engine uses its separate, existing `icr-secret` for image pulls. Deploy the registry digest returned by the successful Buildah task and verify the public application's health and calculation endpoints. Keep API keys in the laboratory environment; never commit credentials or Secret values.

## Prerequisites

- Docker, Node.js 22+, npm, Git, IBM Cloud CLI and the `container-registry` / `code-engine` plugins.
- Existing IBM Cloud Container Registry namespace and Code Engine project; IAM permission to push images and deploy applications.
- A Kubernetes cluster with Tekton Pipelines supporting `tekton.dev/v1`, `kubectl`, `tkn`, dynamic persistent-volume provisioning and outbound access to the required registries.
- A cluster administrator must allow the privileged Buildah task in the selected namespace. Do not apply it in a restricted namespace. An administrator-approved build service is needed if privileged builds are disallowed.

## 1. Test, build and run Docker

From the repository root:

```bash
set -euo pipefail
mkdir -p evidence/local
npm ci
npm test 2>&1 | tee evidence/local/jasmine.txt
docker build --progress plain -t tax-calculator:local . 2>&1 | tee evidence/local/docker-build.txt
docker run -d --name tax-calculator -p 8080:8080 tax-calculator:local
npm run smoke 2>&1 | tee evidence/local/docker-smoke.txt
docker image inspect tax-calculator:local > evidence/local/docker-image.json
docker inspect tax-calculator > evidence/local/docker-container.json
```

Open http://localhost:8080 and save a screenshot showing the result and browser URL. Stop the test container when finished: `docker stop tax-calculator`.

## 2. Tag and push to IBM Container Registry

Replace the namespace and project values with real existing resources. Use your actual registry hostname; this example targets `us.icr.io` in `us-south`.

```bash
export REGION=us-south
export RESOURCE_GROUP=Default
export CE_PROJECT=YOUR_EXISTING_PROJECT
export REGISTRY=us.icr.io
export REGISTRY_NAMESPACE=YOUR_EXISTING_NAMESPACE
export IMAGE="$REGISTRY/$REGISTRY_NAMESPACE/tax-calculator:$(git rev-parse --short HEAD)"
ibmcloud login --sso -r "$REGION" -g "$RESOURCE_GROUP"
ibmcloud plugin install container-registry -f
ibmcloud plugin install code-engine -f
ibmcloud cr region-set us-south
ibmcloud cr login
mkdir -p evidence/cloud
docker tag tax-calculator:local "$IMAGE"
docker push "$IMAGE" 2>&1 | tee evidence/cloud/registry-push.txt
ibmcloud cr images 2>&1 | tee evidence/cloud/registry-images.txt
ibmcloud ce project select --name "$CE_PROJECT"
```

Create a Code Engine registry secret using an API-key file supplied securely by your lab or secret manager. Do not add the file to Git:

```bash
ibmcloud ce secret create --name icr-pull --format registry \
  --server "$REGISTRY" --username iamapikey \
  --password-from-file "$API_KEY_FILE"
```

For the deployment script, supply `IBMCLOUD_API_KEY` through your environment or secret manager, not a committed file or command transcript. `scripts/deploy-ibm.sh` uses the existing project and secret:

```bash
export APP_NAME=tax-calculator
export REGISTRY_SECRET=icr-pull
bash scripts/deploy-ibm.sh
```

Open the actual URL in `evidence/cloud/app-url.txt`, run a calculation, and save `evidence/cloud/deployed-app.jpg`. This image must show the IBM deployment, not localhost. Deployment can incur charges under your account's plan; run these steps only in the intended lab/account.

## 3. Configure Tekton credentials

Use a dedicated Kubernetes namespace with the approved Buildah permissions. Mount credentials as Secrets; never commit a Secret manifest containing actual values. The pipeline ServiceAccount does not need the Kubernetes API token.

Create a restricted Docker config file through your lab or secret manager, with ICR authentication for the same registry hostname. Then:

```bash
kubectl create secret generic icr-auth \
  --type=kubernetes.io/dockerconfigjson \
  --from-file=.dockerconfigjson="$DOCKER_CONFIG_FILE"
kubectl create secret generic ibm-cloud-credentials \
  --from-file=apikey="$API_KEY_FILE"
kubectl apply -f .tekton/service-account.yaml
kubectl apply -f .tekton/tasks.yaml
kubectl apply -f .tekton/pipeline.yaml
```

The Code Engine secret `icr-pull` and Kubernetes Secret `icr-auth` are separate resources. The first permits Code Engine image pulls; the second permits the Buildah push.

## 4. Run and verify Tekton

Copy `.tekton/run.example.yaml` to a file outside Git or a scratch directory; replace `CHANGE_ME` values. For reproducible submission evidence, set `revision` to the commit SHA you want to submit. Use your cluster's storage class if the default does not provision volumes.

```bash
mkdir -p evidence/tekton
RUN=$(kubectl create -f /path/to/configured-run.yaml -o jsonpath='{.metadata.name}')
tkn pipelinerun logs "$RUN" -f 2>&1 | tee evidence/tekton/run-log.txt
kubectl wait --for=condition=Succeeded "pipelinerun/$RUN" --timeout=2700s
kubectl get pipelinerun "$RUN" -o yaml > evidence/tekton/run-status.yaml
kubectl get pipelinerun "$RUN" -o jsonpath='{.status.results}' > evidence/tekton/results.json
```

`fetch → npminstall → tests → build → deploy` is ordered with `runAfter`. Failed tests prevent the build, push and deployment. The build gets a unique run tag. The deployment uses the registry digest returned by Buildah, so it deploys the image built by that run. In the Skills Network lab profile, deployment is a separate Code Engine CLI step after the Pipeline succeeds, matching the course instructions.

The deploy task prints the actual app URL and executes an HTTP smoke check. Download its workspace evidence or retain its logs before deleting the run/PVC. Save a fresh screenshot of the resulting IBM Cloud application. No placeholder URL or example command output is acceptable as proof of execution.

## Stop and clean up

When the course no longer needs the deployment, remove the application through the intended IBM Cloud project and remove the task's image/run resources according to your lab rules. Review exact resource names first. Do not delete shared projects, namespaces or registries.
