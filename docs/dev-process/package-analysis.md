# Package Landscape & Maintenance Plan

This analysis groups the portal's dependencies so the team can plan upgrades,
security reviews, and bundle optimisation. Versions are sourced from
`package.json`.

## 1. Runtime Dependencies

| Package                                                           | Version                | Purpose                                                      | Maintenance Notes                                                                         |
| ----------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `next`                                                            | ^15.5.3                | Core React framework with App Router support.                | Track 15.x release notes for breaking changes in server actions and Turbopack defaults.   |
| `react`, `react-dom`                                              | ^19.1.1                | Rendering layer for client/server components.                | Keep lockstep with Next.js compatibility matrix.                                          |
| `@mdx-js/loader`, `@mdx-js/react`, `@next/mdx`, `next-mdx-remote` | ^3.1.1 / ^5.0.0 combos | MDX authoring, bundling, and runtime rendering.              | Monitor MDX 3 minor releases; confirm Remark/Rehype plugin compatibility before upgrades. |
| `gray-matter`, `reading-time`                                     | ^4.0.3 / ^1.5.0        | Content parsing helpers for blog metadata and reading stats. | Stable packages; review annually for security advisories.                                 |
| `dompurify`, `@types/dompurify`                                   | ^3.2.7 / ^3.0.5        | HTML sanitisation utilities.                                 | Align with CSP updates and add regression tests when upgrading major versions.            |
| `swr`                                                             | ^2.3.6                 | Data fetching cache strategy.                                | Evaluate migration to React Query or Next.js cache APIs if requirements evolve.           |
| `zod`                                                             | ^4.1.11                | Runtime validation and schema definition.                    | Keep schemas centralised to avoid duplication between server and client code.             |

## 2. Development Dependencies

| Package                                                                                          | Version                               | Purpose                                      | Maintenance Notes                                                              |
| ------------------------------------------------------------------------------------------------ | ------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------ |
| `typescript`                                                                                     | ^5.9.2                                | Type checking and language service.          | Adopt TS 6.x once Next.js officially supports it.                              |
| `eslint`, `@eslint/js`, `eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-jsx-a11y` | ^9.36.0 / ^15.5.3 / ^10.1.8 / ^6.10.2 | Linting and accessibility rules.             | Pin to Next.js ESLint presets; rerun `npm run lint -- --max-warnings=0` in CI. |
| `prettier`, `prettier-plugin-tailwindcss`                                                        | ^3.6.2 / ^0.6.14                      | Formatting with Tailwind class ordering.     | Ensure plugin version supports Prettier 3+ when upgrading.                     |
| `tailwindcss`, `autoprefixer`, `postcss`                                                         | ^3.4.0 / ^10.4.21 / ^8.5.6            | Styling pipeline.                            | Evaluate Tailwind 4 beta once design system migration plan is ready.           |
| `@types/node`, `@types/react`                                                                    | ^24.5.2 / ^19.1.13                    | Type definitions for tooling and components. | Update alongside TypeScript to avoid ambient type conflicts.                   |
| `@babel/parser`                                                                                  | ^7.28.4                               | Syntax parsing for MDX tooling.              | Check compatibility when Next.js upgrades Babel internals.                     |

## 3. Scripts & Automation Hooks

Key npm scripts that should be embedded in the CI pipeline and run locally:

- `npm run dev` – Launches the Next.js dev server.
- `npm run type-check` – Executes TypeScript in no-emit mode.
- `npm run lint` – Runs the Next.js ESLint configuration.
- `npm run format:check` – Uses Prettier in check mode to verify formatting.
- `npm run check-all` – Aggregates type check, lint, and formatting checks;
  ideal for pre-commit hooks.

Hook `check-all` into Husky or the CI pipeline so the "run checks after each
change" rule is enforced consistently.

## 4. Upgrade Cadence

1. **Quarterly** – Review React/Next.js releases, Tailwind CSS, and TypeScript
   to stay within one minor version of the latest stable release.
2. **Monthly** – Audit security advisories (via `npm audit` or Dependabot) for
   content parsing and sanitisation packages (`dompurify`, `gray-matter`).
3. **Before Major Features** – Re-run bundle analysis (`npm run analyze`) and
   update documentation under `IMPROVEMENTS.md` with findings from BMad-driven
   tasks.

## 5. Tracking with BMad

- Use `bmad-master *execute-checklist change-checklist` before dependency
  upgrades to capture risk mitigations.
- Assign the `team-all` bundle when planning significant version jumps so
  architecture, QA, and PM stakeholders weigh in simultaneously.
- Document upgrade outcomes via `document-project.md`, storing the output in
  `docs/qa/` or a dedicated changelog.

Maintaining this cadence ensures dependencies stay current, security posture
remains high, and changes are always accompanied by BMad-governed artefacts.
