# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HuBMAP Data Portal — a Flask + React full-stack application backed by Elasticsearch. Deployed at https://portal.hubmapconsortium.org/. The portal displays biological datasets (imaging, RNA-seq, ATAC-seq, etc.) with rich interactive visualizations via Vitessce.

## Repository Layout

- `context/` — the main source tree (the `app` symlink points here)
  - `app/` — Flask backend (Python routes, templates, config)
  - `app/static/js/` — React frontend source
  - `build-utils/` — Webpack configs
  - `package.json` — Node dependencies and scripts
- `end-to-end/` — Cypress E2E tests (separate package)
- `etc/` — development and CI helper scripts
- `figure-generation/` — static figure asset generation
- `pyproject.toml` — Python project config (uses `uv` for dependency management)

## Common Commands

All `npm` commands run from the `context/` directory.

| Task                                | Command                                                |
| ----------------------------------- | ------------------------------------------------------ |
| Start dev servers (webpack + Flask) | `./etc/dev/dev-start.sh`                               |
| Webpack dev server only (port 5001) | `cd context && npm run dev-server`                     |
| Run Jest tests                      | `cd context && npm test`                               |
| Run a single Jest test              | `cd context && npx jest --silent path/to/file.spec.ts` |
| Jest watch mode                     | `cd context && npm run test:watch`                     |
| ESLint                              | `cd context && npm run lint`                           |
| ESLint autofix                      | `cd context && npm run lint:fix`                       |
| TypeScript type check               | `cd context && npm run tsc`                            |
| Production build                    | `cd context && npm run build`                          |
| Storybook (port 6006)               | `cd context && npm run storybook`                      |
| Python tests                        | `uv run pytest`                                        |
| Python lint/format                  | `uv run ruff check` / `uv run ruff format`             |
| Cypress E2E                         | `./etc/test/test-cypress.sh`                           |

## Architecture

### Hybrid Flask-React Routing

Flask handles server-side routing and renders a template (`react-content.html`) with embedded data. React picks up from there — it reads `window.location.pathname` to render the appropriate page component (no React Router library; manual pathname matching in `Routes.jsx`). The webpack dev server proxies non-static requests to Flask on port 5000.

### State Management (Three Tiers)

1. **React Context** — configuration and server-rendered data:
   - `AppContext`: API endpoints, user auth info, feature flags
   - `FlaskDataContext`: entity data passed from Flask on page load
2. **Zustand stores** (`stores/`) — client-side UI state (entity metadata, visualization state, modals). Created via `createStoreContext()` helper in `helpers/zustand/`.
3. **SWR** — data fetching with caching. Custom `fetcher`/`multiFetcher` in `helpers/swr/`. Grafana Faro SDK tracks slow queries.

### Styling

MUI v6 with **styled-components** as the CSS-in-JS engine (not Emotion). Custom theme in `theme/theme.tsx` extends MUI's palette with project-specific colors. Reusable styled components live in `shared-styles/`.

### Webpack Path Aliases

- `js` → `./app/static/js/`
- `assets` → `./app/static/assets/`
- `shared-styles` → `./app/static/js/shared-styles/`

### Portal-Visualization Integration

The Python package `portal-visualization` (in the sibling `portal-visualization` repo) converts dataset metadata into Vitessce viewer configs. Called from `routes_browse.py` via `get_view_config_builder()`. Installed with `[full]` extras for actual rendering support.

## File Conventions

- React components live in their own directories under `components/` or `pages/`.
- Tests: `ComponentName.spec.ts` (Jest, colocated with component)
- Stories: `ComponentName.stories.tsx` (Storybook, colocated)
- E2E: `ComponentName.cy.ts` (Cypress, in `end-to-end/`)
- Each PR must include a `CHANGELOG-<description>.md` file in the repo root, which gets concatenated during deploys.

## Code Style

- Prettier: single quotes, trailing commas, 120 char line width, LF line endings
- ESLint flat config (v9) with TypeScript-ESLint, react-hooks, jsx-a11y, import plugins
- Python: Ruff (line-length 99, pycodestyle + pyflakes rules)
- Pre-commit hooks via Husky run lint-staged on JS/TS/YAML/JSON/MD files.

## Environment

- Node: 24.x (see `.nvmrc`)
- Python: 3.12 (see `.python-version`)
- Python deps managed with `uv`; Node version managed with `nvm` or `n`
