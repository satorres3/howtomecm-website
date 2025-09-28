# BMad-Driven Development Workflow

This document defines a repeatable development workflow for the How to MeCM portal that leverages the **BMad Method** resources bundled in `web-bundles/`. It translates the BMad agents, teams, templates, and checklists into concrete actions the engineering team can run inside this repository.

## 1. Workflow Overview

The workflow is designed to be cyclic so every code or content change travels through the same quality gates. Each phase references the BMad personas that own the work:

1. **Discovery & Planning**  
   *Primary agents*: `analyst`, `pm`, `po`, `ux-expert`.  
   *Key actions*: Capture requirements with `brownfield-create-story` or `project-brief` templates, validate against `pm-checklist` and `po-master-checklist`.
2. **Architecture Alignment**  
   *Primary agents*: `architect`, supported by `bmad-master` for orchestration.  
   *Key actions*: Produce or update solution documentation via `architecture-tmpl.yaml` or `front-end-architecture-tmpl.yaml`. Execute the `architect-checklist` before implementation approval.
3. **Implementation**  
   *Primary agents*: `dev`, with `team-fullstack` when a cross-discipline effort is needed.  
   *Key actions*: Follow tasks such as `generate-ai-frontend-prompt` or `create-next-story` for story-scoped development. Maintain traceability to the planning output.
4. **Quality Assurance**  
   *Primary agents*: `qa` and `sm`.  
   *Key actions*: Run the `story-dod-checklist` (definition of done) and `change-checklist` to confirm regression coverage and communication.
5. **Release & Retro**  
   *Primary agents*: `sm`, `pm`.  
   *Key actions*: Summarise the iteration in `document-project.md`, log retro notes, and ensure follow-up actions are linked to the backlog.

## 2. Daily Operating Rhythm

| Time | Activity | BMad support |
| --- | --- | --- |
| Start of day | Pull latest changes, review open BMad tasks generated from yesterday's outcomes. | `/team-all` stand-up prompt, `sm` agent for coordination. |
| During implementation | Work in short branches. After each meaningful change, run repository checks (see Section 4). | `dev` agent for coding assistance; `architect` for technical design clarifications. |
| Pre-PR | Execute the appropriate checklist (story DoD, change) and capture notes in the PR template. | `qa` agent to ensure coverage; `po` for acceptance criteria confirmation. |
| Post-merge | Update documentation using `document-project` or `index-docs` tasks to keep knowledge base aligned. | `bmad-master` orchestrates documentation tasks. |

## 3. Team Bundles and When to Use Them

- **`team-fullstack`** – Activates `architect`, `dev`, `qa`, `pm`, and `po`. Use this for features that span UI, API, and deployment concerns.
- **`team-ide-minimal`** – Lightweight pair of `dev` + `qa`. Ideal for quick fixes or maintenance tasks with limited scope.
- **`team-no-ui`** – Combines `architect`, `dev`, and `qa` without UX/PO overhead. Good for infrastructure updates.
- **`team-all`** – Engages every persona for workshops, large releases, or when defining cross-cutting standards.

When using the BMad CLI/bundled commands, run the team command (e.g., `/team-fullstack`) before starting collaborative work so the correct personas guide the session.

## 4. Repository Quality Gates

Regardless of task size, run these commands after **each change** before committing or opening a PR:

```bash
npm run type-check
npm run lint
npm run format:check
```

`npm run check-all` chains the commands in the correct order and should be the default when the entire stack must be verified.

## 5. Documentation & Template Usage

| Scenario | Recommended template/task |
| --- | --- |
| New feature or enhancement | `story-tmpl.yaml` via `create-doc` task, executed by `po` or `sm`. |
| Architecture update | `front-end-architecture-tmpl.yaml` or `fullstack-architecture-tmpl.yaml`, executed by `architect`. |
| Market or competitor research | `market-research-tmpl.yaml` or `competitor-analysis-tmpl.yaml`, led by `analyst`. |
| Sprint or release summary | `document-project.md` task orchestrated by `sm`. |

Store generated outputs under `docs/` to keep them version-controlled and accessible.

## 6. Checklists for Consistency

To keep delivery consistent, wire the following checklists into review steps:

- `story-draft-checklist` – Validate stories before development begins.
- `story-dod-checklist` – Ensure acceptance criteria, testing, and documentation are complete.
- `change-checklist` – Confirm stakeholder communication, roll-back plan, and monitoring.
- `architect-checklist` – Guarantee architectural decisions align with standards and performance targets.

Each checklist is available through `execute-checklist {name}` via the `bmad-master` agent or the corresponding persona.

## 7. Incorporating BMAD into Tooling

1. **Set up the CLI locally** (optional but recommended): `npx bmad-method install` and select the relevant expansion pack. The bundled resources in `web-bundles/` allow fully offline operation if required.
2. **Automate prompts** by storing frequently used commands (e.g., `/team-fullstack`, `*create-doc story-tmpl.yaml`) in your editor snippets.
3. **Link to issue tracker** by copying outputs from BMad tasks directly into tickets or PR descriptions so that rationale and acceptance criteria stay discoverable.

## 8. Continuous Improvement Loop

- Review the effectiveness of this workflow at the end of each sprint during retrospectives.
- Encourage each persona to update templates or checklists when gaps are identified.
- Keep `IMPROVEMENTS.md` aligned with actual process changes, noting the BMad assets used for each improvement phase.

By embracing the BMad Method across discovery, implementation, and validation, the team gains a consistent, automation-friendly process that keeps quality checks front and centre and allows quick onboarding of new contributors.
