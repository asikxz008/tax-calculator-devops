# Epic: Modernize and deliver the Tax Calculator

GitHub epic: [#1](https://github.com/asikxz008/tax-calculator-devops/issues/1). Stories: [#2](https://github.com/asikxz008/tax-calculator-devops/issues/2), [#3](https://github.com/asikxz008/tax-calculator-devops/issues/3), [#4](https://github.com/asikxz008/tax-calculator-devops/issues/4), [#5](https://github.com/asikxz008/tax-calculator-devops/issues/5).

As a learner, I want a tested, containerized tax calculator delivered by a repeatable pipeline so that I can demonstrate the complete development-to-deployment workflow.

## Story A: Calculate and verify tax
As a user, I want to enter income and deductions and see the tax, effective rate and take-home income.

Acceptance criteria:
- Progressive teaching brackets are displayed and deductions apply before taxation.
- Negative, non-numeric and out-of-range values are rejected.
- Jasmine covers bracket boundaries, deductions, rounding and HTTP responses.
- Real test output is saved in `evidence/01-jasmine.txt`.

## Story B: Package and run a container
As a developer, I want a reproducible image so that the same application runs locally and in the cloud.

Acceptance criteria:
- Docker builds run Jasmine and fail when tests fail.
- The runtime runs as an unprivileged user on port 8080.
- A running container passes `/health` and the calculation smoke test.
- Build output and container verification are attached as CI artifacts.

## Story C: Deploy to IBM Cloud
As a maintainer, I want the image pushed to IBM Cloud Container Registry and deployed to Code Engine.

Acceptance criteria:
- The registry namespace and project belong to the learner's authorized account.
- Image push output, actual application URL, health response and screenshot are retained.
- API keys remain outside the repository.

## Story D: Automate with Tekton
As a maintainer, I want clone → Jasmine → build/push → deploy so failed tests prevent publishing and deployment.

Acceptance criteria:
- Tasks, Pipeline and a configurable PipelineRun are versioned.
- The deployed image uses the digest returned by the push step.
- A real successful PipelineRun and application verification are retained.

## Definition of done
Code reviewed, relevant tests passing, documentation updated, and task-specific execution evidence recorded. Configuration alone does not prove that a cloud deployment or PipelineRun completed.
