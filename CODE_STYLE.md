# EduHealth FE Coding Style (Unified)

## 1. Technology Baseline
- Language: JavaScript (`.js`, `.jsx`) only.
- UI framework: React + React Router.
- Styling standard: Tailwind utility classes in `className`.
- Global theme/tokens source: `src/assets/styles/index.css`.

## 2. Styling Rules (Required)
- Use Tailwind utility classes as the default for all new UI.
- Do not introduce `styled-components`, Emotion, or inline style objects for normal layout work.
- Inline `style={{ ... }}` is allowed only for dynamic values that cannot be expressed cleanly with utilities.
- Reuse shared classes/tokens (`signature-gradient`, color tokens, font tokens) instead of redefining colors in each component.

## 3. Component Structure
- Keep page files focused on composition.
- Extract repeated sections into feature components.
- Put shared reusable UI in `src/shared/components/common`.
- Keep component names PascalCase and file names matching component names.

## 4. Routing and Links
- Use `Link` or `navigate` from React Router for internal navigation.
- No full-page reload for internal routes.

## 5. Data and API
- Keep API calls in feature service/api files, not in large page JSX blocks.
- Keep UI state handling explicit: loading, error, empty, success.

## 6. Consistency Checklist for PRs
- No new styling library added.
- New UI uses Tailwind className.
- Shared components reused when available.
- Internal links use React Router.
- No hardcoded auth/token/role values.

## 7. Enforcement
- ESLint blocks `styled-components`, `@emotion/react`, and `@emotion/styled` imports.
- Use `npm run lint` before pushing to ensure coding-style rules are respected.
