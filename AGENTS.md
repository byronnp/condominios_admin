# Repository Guidelines

## Project Structure & Module Organization

This is a Quasar 2 / Vue 3 / TypeScript SPA for condominium administration. Main application code lives in `src/`.

- `src/pages/`: route-level views, such as `LoginPage.vue`.
- `src/layouts/`: shared page shells, currently `MainLayout.vue`.
- `src/router/`: Vue Router setup and route declarations.
- `src/stores/`: Pinia store registration and future domain stores.
- `src/interfaces/`: TypeScript interfaces organized by screen or shared domain. Use subfolders such as `condominiums/`, `create-condominium/`, `edit-condominium/`, `dashboard/`, and `shared/`.
- `src/services/`: API clients and data access. Keep HTTP calls here and read API configuration from `VITE_API_HOST`.
- `src/composables/`: Vue reusable state and workflows. Use composables to expose loading, error, data, and actions that call services.
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

Keep screen and domain interfaces in `src/interfaces/<screen-or-domain>/` instead of declaring reusable object shapes inside Vue components. Keep UI styles centralized in `src/css/app.scss` unless local scoped styles are clearly justified. Reuse Quasar components and Material Icons from `quasar.config.ts`. Run `npm run lint` before submitting changes.

Keep API access out of pages. Pages should call composables; composables should call services; services should own endpoint paths, request payloads, and response parsing.

## API Implementation Guidelines

The backend base URL is configured in the environment variable `VITE_API_HOST`. Use it as the reference for backend requests and for checking backend-exposed documentation or endpoints when available.

Before implementing or changing any API consumption, read the backend documentation first and align the frontend with the documented endpoint, HTTP method, payload, query params, response shape, error format, and authentication requirements. Do not infer API contracts from mock UI data when backend docs are available.

If the backend documentation is missing, outdated, or ambiguous, note the uncertainty before implementing and keep the service/composable code narrowly scoped so it can be adjusted once the contract is confirmed.

API request payloads must always come from the backend API documentation. Do not invent payload fields from existing UI mock data, page labels, or assumptions about common CRUD forms. If the documentation for a write endpoint is not available, do not finalize the write payload; ask for the documentation or mark the implementation as blocked/temporary until the contract is confirmed.

Use Pinia for non-sensitive session state only. Authentication must use the secure HttpOnly cookie flow: services send requests with `credentials: 'include'`, `/auth/login` sets the cookie, `/auth/me` restores the session, and `/auth/logout` clears it. Do not store access tokens in Pinia, `localStorage`, or `sessionStorage`.

Catalog endpoints follow `GET /api/admin/catalogs/{catalogId}` through `VITE_API_HOST`; consume only `items[].id` and `items[].name` for select options unless backend documentation states otherwise. The operational status catalog used by condominium editing is catalog id `4`.

Condominium API responses may wrap arrays as a direct array, `items`, `condominiums`, `data`, `data.items`, `data.condominiums`, or `data.data`. Service parsing should tolerate these shapes narrowly and return an empty array only after checking the documented wrappers.

Do not assume condominium `status` is always a string. Normalize status values in composables/services before UI use; it may arrive as a string, number, or object such as `{ id, name }`. Use the display `name` when present, otherwise stringify the id/value.

## UI Style Guidelines

Keep form fields and buttons compact, soft, and consistent across the project. Avoid oversized controls and sharp rectangular corners.

- Use Quasar `dense` inputs for login, admin forms, filters, and compact data-entry workflows unless a larger touch target is explicitly needed.
- Prefer rounded controls around `10px` to `12px` border radius. Inputs and primary action buttons should not look square.
- Keep standard admin buttons near `38px` to `44px` tall. Avoid `size="lg"` for routine actions.
- Use modest horizontal padding on buttons so labels fit comfortably without making controls visually heavy.
- Centralize shared button and input styling in `src/css/app.scss`; use local classes only when a screen needs a specific adjustment.
- Keep icon-only actions round, but use rounded rectangular buttons for text actions.
- Every screen must be responsive down to mobile widths. Use one-column forms on small screens, stack page actions, reduce panel padding, and avoid text or controls overflowing their containers.
- Metric rows and summary blocks must use a real CSS grid or Quasar grid layout; do not stack cards one-per-row unless the screen is intentionally single-column.
- For house management, keep the condominium-scoped view and the global admin view separate. The route `/condominios/:id/casas` should stay scoped to one condominium, while `/admin/casas` is the global inventory view for super-admin workflows.
- To create or assign a house owner, use an explicit owner assignment flow tied to an existing user/resident record; do not model the owner as free text inside the house form. If the backend contract for owner creation or linking is missing, keep the UI narrowly scoped and avoid inventing payload fields.
- When a form section has no data to show, display a clear empty-state note that explains what is missing and what action the client should take next.
- Data tables must remain usable on mobile. Prefer Quasar grid/card mode or a controlled horizontal scroll with compact row actions instead of forcing wide desktop tables into the viewport.
- If a table is replaced with cards, use a deliberate multi-column card grid on desktop and collapse to one column only at small breakpoints.
- Delete actions must always show a confirmation dialog before performing the deletion.
- Place reusable dialogs under `src/components/dialogs/`. Dialog components should receive data through props, expose visibility with `v-model`, and emit user actions instead of owning page-level navigation or data fetching.
- Use the established minimal dialog pattern for future dialogs: simple white header, title plus one concise subtitle, status/action controls aligned to the right, no decorative avatar unless it adds clear meaning, compact rounded buttons, key details only, and responsive single-column content on mobile.

## Testing Guidelines

No test framework is configured yet. Until one is added, validate changes with `npm run lint`, `npm run build`, and manual checks in `npm run dev`.

When tests are introduced, place unit tests near the module or under `tests/`. Use names such as `LoginPage.spec.ts`.

## Commit & Pull Request Guidelines

The current history only contains an initial commit, so no strict convention is established. Use short, imperative commit messages such as `Add role-aware dashboard`.

Pull requests should include a concise summary, screenshots for UI changes, verification steps, and known limitations. Link related issues when available.

## Security & Configuration Tips

Do not commit secrets, API tokens, or production credentials. Keep environment-specific values in local `.env` files. Current role handling is demo-only and should be replaced by backend user data before production.
