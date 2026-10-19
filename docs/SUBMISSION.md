# Submission evidence

Repository: https://github.com/asikxz008/tax-calculator-devops

Verified CI run: https://github.com/asikxz008/tax-calculator-devops/actions/runs/39271499786

Tested commit: `41e86369076848e77ce11388e3c38b7332abd87c`.
Docker image ID: `sha256:02a146a3a2d7c6bdca90794643f828118560969606552986ec20e4d8568711e6`.
This is the locally built image ID on the GitHub-hosted runner, not an IBM registry digest.

This file separates prepared code from actual execution. Do not submit a pending item as completed. The original course starter and exact question-by-question submission format were not supplied.

| Rubric item | Code / evidence | Status |
| --- | --- | --- |
| 1. Run Jasmine | `spec/`, `evidence/01-jasmine-tests-passing.txt` | Executed with `npx jasmine`: 7 specs, 0 failures |
| 2. Create Dockerfile | `Dockerfile`, `.dockerignore` | Implemented |
| 3. Build Docker image | `evidence/03-docker-build.txt`; successful CI run above | Executed on GitHub-hosted Linux runner |
| 4. Deploy/test Docker container | `evidence/04-docker-smoke.txt`, `evidence/ci-success.jpg` | Real Docker container passed health and calculation checks in CI |
| 5. Tag/push to IBM Registry | `docs/DEPLOYMENT.md` section 2 | Pending: IBM Cloud access |
| 6. Deploy to IBM Cloud | `scripts/deploy-ibm.sh` | Pending: IBM Cloud access and actual screenshot |
| 7. Create Tekton tasks | `.tekton/tasks.yaml` | Accepted by the Tekton webhook; npm and Jasmine tasks executed in the verification profile |
| 8. Extend Pipeline | `.tekton/pipeline.yaml` | IBM profile implemented; verification profile executed all five steps |
| 9. Run Tekton | `.tekton/run.yaml`; `evidence/tekton-verification/run-status.yaml` | Real verification PipelineRun succeeded in kind; IBM profile still requires credentials |
| 10. Deploy pipeline image | `evidence/tekton-verification/10-final-output.png` | Image built and deployed by Tekton in kind; not IBM Cloud |

Planning artifacts are in `docs/PLAN.md`. GitHub Actions is additional evidence and does not replace the explicitly required Tekton run. The local Windows machine had no Docker installation; container verification ran on GitHub's runner. `evidence/local-preview.jpg` shows the local Node.js app and must not be submitted as an IBM Cloud screenshot.

GitHub planning issues:
- Epic: https://github.com/asikxz008/tax-calculator-devops/issues/1
- Calculation and Jasmine: https://github.com/asikxz008/tax-calculator-devops/issues/2
- Containerization: https://github.com/asikxz008/tax-calculator-devops/issues/3
- IBM Cloud deployment: https://github.com/asikxz008/tax-calculator-devops/issues/4
- Tekton automation: https://github.com/asikxz008/tax-calculator-devops/issues/5

The confirmed implementation and execution do not yet cover all ten rubric items. IBM Registry and IBM Cloud deployment still require the learner's cloud/lab access. The verification profile proves actual Tekton execution and deployment on kind, not the IBM-specific stages; a passing assessment score cannot be claimed.

## Actual Tekton build and deployment

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

## Files to collect after cloud execution

- `evidence/cloud/registry-push.txt`
- `evidence/cloud/registry-images.txt`
- `evidence/cloud/deploy.txt`
- `evidence/cloud/app-status.txt`
- `evidence/cloud/app-url.txt`
- `evidence/cloud/smoke.txt`
- `evidence/cloud/deployed-app.jpg`
- `evidence/tekton/run-log.txt`
- `evidence/tekton/run-status.yaml`
- `evidence/tekton/results.json`

Missing evidence files are intentionally absent; no simulated success logs are provided.
