# Tax Calculator — DevOps final project

**Course assessment correction:** use [juphc-tc_pipeline](https://github.com/asikxz008/juphc-tc_pipeline) and its [complete corrected answers](https://github.com/asikxz008/juphc-tc_pipeline/blob/main/SUBMISSION.txt). The assessment requires an nginx Dockerfile with five named static assets and this exact repository name. The public Code Engine apps now serve that static nginx version. This repository retains the earlier independent Node.js implementation and historical execution evidence; its API smoke checks describe that earlier runtime.

Educational Node.js application with Jasmine tests, a multi-stage Dockerfile, GitHub Actions container verification, IBM Cloud deployment instructions and Tekton definitions.

**Repository:** https://github.com/asikxz008/tax-calculator-devops

**IBM Cloud deployment:** [open the actual calculator](https://tax-calculator.2g4jzy6r91sb.us-south.codeengine.appdomain.cloud/). Built and pushed to IBM Registry in Skills Network Labs, deployed to IBM Code Engine and passed health/calculation checks. [Actual cloud evidence](evidence/cloud/) includes the terminal output and screenshot. Educational resources can expire.

**Current tests:** the same calculation and HTTP scenarios are grouped into seven specs to match the assessment format. Actual `npx jasmine` output: [7 specs, 0 failures](evidence/01-jasmine-tests-passing.txt).

**Earlier verified CI:** [successful CI run](https://github.com/asikxz008/tax-calculator-devops/actions/runs/39271499786): the earlier 30-spec layout passed; Docker image built; a real running container passed health and calculation smoke checks. [Submission status](docs/SUBMISSION.md) records actual execution and remaining steps.

**Actual IBM Tekton execution:** PipelineRun `tax-calculator-lab-v9zmh` completed all four tasks in Skills Network OpenShift, passed seven Jasmine specs and built/pushed the image to IBM Registry. Its exact digest is [deployed in IBM Code Engine](https://tax-calculator-pipeline.2g4jzy6r91sb.us-south.codeengine.appdomain.cloud/) and passed health/calculation checks. [Screenshot and actual logs](evidence/tekton-cloud/) document the run and deployment. The earlier [kind verification](docs/TEKTON-VERIFICATION.md) is retained separately.

This is a new implementation prepared from the supplied assessment rubric. No original course starter or exact tax rules were supplied. The rates are fictional teaching data, not current tax rules for any jurisdiction. If the course requires a particular starter or calculation formula, reconcile those requirements before submitting.

## Run locally

Requires Node.js 22 or newer and npm.

```bash
npm ci
npm test
npm start
```

Open http://localhost:8080. In a second terminal run `npm run smoke`.

## Features and teaching brackets

Enter annual gross income and deductions. The API returns taxable income, tax per bracket, total tax, gross income minus tax, and the effective tax rate (tax / gross income). Deductions lower taxable income; they are not subtracted a second time from take-home income.

| Taxable income band | Marginal rate |
| --- | ---: |
| 0–10,000 | 0% |
| 10,000–40,000 | 10% |
| 40,000–100,000 | 20% |
| Over 100,000 | 30% |

Amounts are converted to cents before calculation; each bracket's tax rounds to the nearest cent. Input range: 0 to 1 trillion. There are no runtime npm dependencies and no stored personal data.

```bash
curl http://localhost:8080/health
curl -X POST http://localhost:8080/api/calculate \
  -H 'Content-Type: application/json' \
  -d '{"income":85000,"deductions":5000}'
```

Expected calculation: taxable income 80,000; tax 11,000; take-home income 74,000.

## Docker

```bash
docker build --progress plain -t tax-calculator:local .
docker run -d --name tax-calculator -p 8080:8080 tax-calculator:local
npm run smoke
docker logs tax-calculator
docker stop tax-calculator
```

The `test` build stage runs Jasmine. The runtime copies only application source and static assets and runs as the `node` user. `/health` is available for health probes. `PORT` defaults to 8080.

GitHub Actions runs tests, builds the Docker image, starts a real container and saves logs as downloadable artifacts. This is additional CI verification; it does not replace the required Tekton run or IBM Cloud deployment.

## Planning, deployment and evidence

- [Epic and stories](docs/PLAN.md)
- [IBM Cloud and Tekton runbook](docs/DEPLOYMENT.md)
- [Assessment evidence and remaining work](docs/SUBMISSION.md)
- Skills Network: [Tekton Tasks](.tekton/lab/tasks.yaml), [Pipeline](.tekton/lab/pipeline.yaml), [PipelineRun](.tekton/lab/run.yaml)
- Generic IBM profile: [Tasks](.tekton/tasks.yaml), [Pipeline](.tekton/pipeline.yaml), [PipelineRun example](.tekton/run.example.yaml)

The course-provided lab supplies the cloud resources and Tekton cluster. Actual manual IBM deployment and the Skills Network Tekton build/push followed by deployment of its digest are verified. Credentials remain in lab Secrets.

## Documentation consulted

- [Jasmine Node.js setup](https://jasmine.github.io/setup/nodejs.html)
- [Docker Node.js guide](https://docs.docker.com/guides/nodejs/)
- [Tekton Tasks](https://tekton.dev/docs/pipelines/tasks/)
- [Tekton PipelineRuns](https://tekton.dev/docs/pipelines/pipelineruns/)
- [IBM Code Engine CLI](https://cloud.ibm.com/docs/codeengine?topic=codeengine-cli)
- [IBM pipeline base images](https://cloud.ibm.com/docs/ContinuousDelivery?topic=ContinuousDelivery-pipeline_versioned_base_images)
