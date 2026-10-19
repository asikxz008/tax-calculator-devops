# Submission evidence

Repository: https://github.com/asikxz008/tax-calculator-devops

Verified CI run: https://github.com/asikxz008/tax-calculator-devops/actions/runs/39271499786

Tested commit: `41e86369076848e77ce11388e3c38b7332abd87c`.
Docker image ID: `sha256:02a146a3a2d7c6bdca90794643f828118560969606552986ec20e4d8568711e6`.
This is the locally built image ID on the GitHub-hosted runner, not an IBM registry digest.

This file records actual execution. The application is an independent teaching implementation; it was not copied from the original course starter.

| Rubric item | Code / evidence | Status |
| --- | --- | --- |
| 1. Run Jasmine | `spec/`, `evidence/01-jasmine-tests-passing.txt` | Executed with `npx jasmine`: 7 specs, 0 failures |
| 2. Create Dockerfile | `Dockerfile`, `.dockerignore` | Implemented |
| 3. Build Docker image | `evidence/03-docker-build.txt`; successful CI run above | Executed on GitHub-hosted Linux runner |
| 4. Deploy/test Docker container | `evidence/04-docker-smoke.txt`, `evidence/ci-success.jpg` | Real Docker container passed health and calculation checks in CI |
| 5. Tag/push to IBM Registry | `evidence/cloud/05-docker-icr-push.txt` | Actual push succeeded in the Skills Network-provided IBM Registry namespace |
| 6. Deploy to IBM Cloud | `evidence/cloud/06-deployed-on-cloud.txt`, `app-status.txt`, `smoke.txt`, `06-deployed-on-cloud.jpg` | Actual IBM Code Engine application is Running and passed the API smoke check |
| 7. Create Tekton tasks | `.tekton/lab/tasks.yaml` | npm and Jasmine Tasks executed successfully in Skills Network OpenShift |
| 8. Extend Pipeline | `.tekton/lab/pipeline.yaml` | clone, npminstall, tests and Buildah build/push all succeeded |
| 9. Run Tekton | `.tekton/lab/run.yaml`; `evidence/tekton-cloud/run-status.yaml` | PipelineRun tax-calculator-lab-v9zmh: Succeeded=True, four tasks completed, no failures or skipped tasks |
| 10. Deploy pipeline image | `evidence/tekton-cloud/10-final-output.jpg` | The exact pipeline image digest is deployed in IBM Code Engine and passed smoke checks |

Planning artifacts are in `docs/PLAN.md`. GitHub Actions is additional evidence and does not replace the explicitly required Tekton run. The local Windows machine had no Docker installation; container verification ran on GitHub's runner. `evidence/local-preview.jpg` shows the local Node.js app and must not be submitted as an IBM Cloud screenshot.

GitHub planning issues:
- Epic: https://github.com/asikxz008/tax-calculator-devops/issues/1
- Calculation and Jasmine: https://github.com/asikxz008/tax-calculator-devops/issues/2
- Containerization: https://github.com/asikxz008/tax-calculator-devops/issues/3
- IBM Cloud deployment: https://github.com/asikxz008/tax-calculator-devops/issues/4
- Tekton automation: https://github.com/asikxz008/tax-calculator-devops/issues/5

The course provides IBM Cloud infrastructure through Skills Network Labs. A separate personal IBM Cloud registration or bank card is not needed for this lab. Actual manual and pipeline-built IBM deployments are recorded below. The earlier kind verification is retained as additional evidence. Assessment credit remains up to the course assessor.

## Actual IBM Cloud manual deployment

Application: https://tax-calculator.2g4jzy6r91sb.us-south.codeengine.appdomain.cloud/

Image: `us.icr.io/sn-labs-sabyraslan20/tax-calculator:manual-5310dc5`.
Registry digest: `sha256:c09460bdc8425f67594db8fcc3b931e6590adc5bc05cf458fdcd7af978e07296`.

The image was built from the project's Dockerfile in the course-provided Cloud IDE
and pushed with Docker. Code Engine created the application using the lab's
existing `icr-secret`, port 8080, 0.25 CPU, 0.5G memory and scale 0–1. The real
CLI output ended in `OK`; application status showed Running. The public URL
passed the health and calculation checks with tax 11,000 on income 85,000 and
deductions 5,000. The screenshot was captured from that public application URL.
These resources belong to the temporary educational environment and can expire.

Course launch: https://www.coursera.org/learn/cloud-native-devops-agile-nosql/ungradedLti/mIHA4/final-project-option-b-javascript-part-b-and-c-tax-calculator

The lab's "Task 5: Manual deploy on IBM Cloud" explicitly states that basic
infrastructure is provided and external sign-up is unnecessary. Open Cloud >
Code Engine > Create Project in the IDE, then Code Engine CLI to use the
preconfigured project and Kubeconfig. Use a separate ordinary terminal for
Tekton in the learner's OpenShift namespace.

## Actual IBM Tekton build and deployment

PipelineRun: `tax-calculator-lab-v9zmh` in `sn-labs-sabyraslan20`, completed on 2026-10-19 with `Succeeded=True`: four tasks completed, zero failed, cancelled or skipped. The submitted revision and resolved commit are `5310dc53ec0e57fdea5a900e60a20d453cf4f267`.

The existing lab ClusterTasks cloned the source and built/pushed the image. The npm Task installed dependencies, then the Jasmine Task reported `7 specs, 0 failures` (seed 22982). Buildah pushed:

`us.icr.io/sn-labs-sabyraslan20/tax-calculator:tax-calculator-lab-v9zmh`

Registry digest: `sha256:0b0aa091392b15e354b439dbd317916d7c1311a6db4577d2569e022fb7f00ec6`.

The Code Engine CLI then deployed that exact digest as `tax-calculator-pipeline`, using the existing lab registry pull secret, port 8080, 0.25 CPU, 0.5G memory and scale 0–1. Application status reported successful deployment, Ready=true and Running. The health/calculation smoke check passed with tax 11,000.

Application: https://tax-calculator-pipeline.2g4jzy6r91sb.us-south.codeengine.appdomain.cloud/

Submit these URLs for the course's code questions:

- Task 7: https://github.com/asikxz008/tax-calculator-devops/blob/main/.tekton/lab/tasks.yaml
- Task 8: https://github.com/asikxz008/tax-calculator-devops/blob/main/.tekton/lab/pipeline.yaml
- Task 9: https://github.com/asikxz008/tax-calculator-devops/blob/main/.tekton/lab/run.yaml
- Task 10: upload `evidence/tekton-cloud/10-final-output.jpg`.

Actual PipelineRun/TaskRun status, submitted YAML, task logs, deployment output, pinned image reference and API check are in `evidence/tekton-cloud/`. The screenshot was captured from the public Code Engine URL above. Credentials remain in the lab and are absent from the repository. These educational resources can expire.

## Earlier kind verification

Successful run: https://github.com/asikxz008/tax-calculator-devops/actions/runs/39295132176

Tested commit: `8ec2de551ef20b60d49b43ce7b59a002b381d6ee`.
PipelineRun: `tax-verification`, condition `Succeeded=True`, five tasks completed,
zero failures or skipped tasks. Jasmine reported `7 specs, 0 failures`.
Docker image ID: `sha256:89ef3c3ee0e135d70c179c613defbaa238e59100d63593233a5310007f59efb1`.

The screenshot `evidence/tekton-verification/10-final-output.png` was captured by
Chrome from the actual Kubernetes Service after the Tekton deploy task completed.
The API smoke check passed and the rendered page showed `$11,000.00` tax.
The image details, submitted and completed PipelineRun YAML, running pod details,
and task logs are alongside the screenshot. See `PROVENANCE.txt` and
[the verification profile description](TEKTON-VERIFICATION.md).

The cluster was disposable and deleted after the run. This evidence must not be
described as an IBM Cloud deployment or IBM Registry push. Acceptance as a
substitute for IBM-specific requirements is up to the course assessor.

## What to submit for each completed task

- Link directly to the relevant code file at the submitted commit.
- Include the actual terminal output or pipeline run URL.
- For deployment, include the real application URL and a screenshot showing its result and URL.
- Exclude tokens, API keys, secret files and environment dumps.

## Collected cloud pipeline files

- `evidence/tekton-cloud/run-submitted.yaml`
- `evidence/tekton-cloud/run-status.yaml` and `run-status.json`
- `evidence/tekton-cloud/taskruns.yaml`
- `evidence/tekton-cloud/tax-calculator-lab-v9zmh-*-pod.txt`
- `evidence/tekton-cloud/image-digest-ref.txt`
- `evidence/tekton-cloud/deploy.txt`
- `evidence/tekton-cloud/app-status.txt` and `app-url.txt`
- `evidence/tekton-cloud/smoke.txt`
- `evidence/tekton-cloud/10-final-output.jpg`
- `evidence/tekton-cloud/PROVENANCE.txt`

These are actual captured results; no simulated success logs are provided.
