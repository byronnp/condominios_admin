# Repository Guidelines

## Project Structure & Module Organization

This is a Quasar 2 / Vue 3 / TypeScript SPA for condominium administration. Main application code lives in `src/`.

- `src/pages/`: route-level views, such as `LoginPage.vue`.
- `src/layouts/`: shared page shells, currently `MainLayout.vue`.
- `src/router/`: Vue Router setup and route declarations.
- `src/stores/`: Pinia store registration and future domain stores.
- `src/css/`: global SCSS. Keep shared styles in `app.scss`; Quasar theme variables belong in `quasar.variables.scss`.
- `src/assets/` and `public/`: images, icons, and static assets.

## Build, Test, and Development Commands

- `npm run dev`: starts the Quasar development server.
- `npm run build`: creates a production SPA build in `dist/spa`.
- `npm run lint`: runs ESLint over Vue, TypeScript, and JavaScript files.
- `npm run format`: formats supported files with Prettier.
- `npm run test`: currently a placeholder and exits with an error.
Use Node versions supported by `package.json`: `^22.12`, `^24`, `^26`, or `^28`.

## Coding Style & Naming Conventions

Use Vue single-file components with `<script setup lang="ts">`. Prefer TypeScript types for roles, API payloads, and UI models. Use PascalCase for Vue component files (`LoginPage.vue`) and camelCase for variables and functions.

Keep UI styles centralized in `src/css/app.scss` unless local scoped styles are clearly justified. Reuse Quasar components and Material Icons from `quasar.config.ts`. Run `npm run lint` before submitting changes.

## Testing Guidelines

No test framework is configured yet. Until one is added, validate changes with `npm run lint`, `npm run build`, and manual checks in `npm run dev`.

When tests are introduced, place unit tests near the module or under `tests/`. Use names such as `LoginPage.spec.ts`.

## Commit & Pull Request Guidelines

The current history only contains an initial commit, so no strict convention is established. Use short, imperative commit messages such as `Add role-aware dashboard`.

Pull requests should include a concise summary, screenshots for UI changes, verification steps, and known limitations. Link related issues when available.

## Security & Configuration Tips

Do not commit secrets, API tokens, or production credentials. Keep environment-specific values in local `.env` files. Current role handling is demo-only and should be replaced by backend user data before production.
