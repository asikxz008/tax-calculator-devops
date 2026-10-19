# Submission evidence

Repository: https://github.com/asikxz008/tax-calculator-devops

This file separates prepared code from actual execution. Do not submit a pending item as completed. The original course starter and exact question-by-question submission format were not supplied.

| Rubric item | Code / evidence | Status |
| --- | --- | --- |
| 1. Run Jasmine | `spec/`, `evidence/01-jasmine.txt` | Executed locally: 30 specs, 0 failures |
| 2. Create Dockerfile | `Dockerfile`, `.dockerignore` | Implemented |
| 3. Build Docker image | GitHub Actions build step; artifact `docker-build.txt` | Await CI verification |
| 4. Deploy/test Docker container | CI smoke test; local preview screenshot | Await CI verification; local preview alone is not Docker evidence |
| 5. Tag/push to IBM Registry | `docs/DEPLOYMENT.md` section 2 | Pending: IBM Cloud access |
| 6. Deploy to IBM Cloud | `scripts/deploy-ibm.sh` | Pending: IBM Cloud access and actual screenshot |
| 7. Create Tekton tasks | `.tekton/tasks.yaml` | Implemented; cluster execution pending |
| 8. Extend Pipeline | `.tekton/pipeline.yaml` | Implemented; cluster validation pending |
| 9. Run Tekton | `.tekton/run.example.yaml` | Pending: Tekton-enabled cluster and credentials |
| 10. Deploy pipeline image | Digest passed from build to deploy task | Pending: successful cloud PipelineRun |

Planning artifacts are in `docs/PLAN.md`. The CI result URL and screenshot should be recorded after the first push. GitHub Actions is additional evidence and does not replace the explicitly required Tekton run.

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
