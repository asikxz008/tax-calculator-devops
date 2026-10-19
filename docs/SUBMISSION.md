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
| 7. Create Tekton tasks | `.tekton/tasks.yaml` | Implemented; cluster execution pending |
| 8. Extend Pipeline | `.tekton/pipeline.yaml` | Implemented; cluster validation pending |
| 9. Run Tekton | `.tekton/run.example.yaml` | Pending: Tekton-enabled cluster and credentials |
| 10. Deploy pipeline image | Digest passed from build to deploy task | Pending: successful cloud PipelineRun |

Planning artifacts are in `docs/PLAN.md`. GitHub Actions is additional evidence and does not replace the explicitly required Tekton run. The local Windows machine had no Docker installation; container verification ran on GitHub's runner. `evidence/local-preview.jpg` shows the local Node.js app and must not be submitted as an IBM Cloud screenshot.

GitHub planning issues:
- Epic: https://github.com/asikxz008/tax-calculator-devops/issues/1
- Calculation and Jasmine: https://github.com/asikxz008/tax-calculator-devops/issues/2
- Containerization: https://github.com/asikxz008/tax-calculator-devops/issues/3
- IBM Cloud deployment: https://github.com/asikxz008/tax-calculator-devops/issues/4
- Tekton automation: https://github.com/asikxz008/tax-calculator-devops/issues/5

The confirmed implementation and execution do not yet cover all ten rubric items. Cloud deployment and Tekton execution require the learner's IBM Cloud/lab access; a passing assessment score cannot be claimed from the prepared code alone.

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
