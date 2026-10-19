# Real Tekton verification without IBM Cloud credentials

The `Real Tekton build and deployment` GitHub Actions workflow starts a disposable
kind Kubernetes cluster and installs the real Tekton Pipelines controller. Tekton
runs `fetch -> npminstall -> tests -> build -> deploy`. The npm and Jasmine tasks
are the same definitions as the IBM Cloud profile. The verification build task
builds the Dockerfile and loads its uniquely tagged image into the kind node;
the deploy task creates a Kubernetes Deployment and Service using that image.

After rollout, the workflow checks the health and tax calculation endpoints,
records the running pod's image ID, and captures `10-final-output.png` from the
actual application with headless Chrome. It uploads the image, real PipelineRun
status, TaskRun logs, deployment and image details as a workflow artifact. A DOM
check confirms that the displayed result contains `$11,000.00`.

This is a real Tekton execution and Kubernetes deployment on a GitHub-hosted
runner. **It is not an IBM Cloud or IBM Container Registry deployment.** The
cluster is deleted at the end of the run; the evidence artifact remains. The
original `.tekton/pipeline.yaml` and `.tekton/run.yaml` retain the IBM Cloud
configuration and still require the learner's cloud project and credentials.

The verification build task mounts the Docker socket only inside this disposable
CI environment. It must not be applied to a shared or production cluster. The
application's service account token is disabled; the deployment task has a
namespace-scoped role limited to Deployments and Services.
