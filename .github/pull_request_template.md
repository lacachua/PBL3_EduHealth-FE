## Summary
- Describe what changed and why.

## Scope
- [ ] Only necessary files were changed.
- [ ] No unrelated refactor was included.

## Styling Convention (Required)
- [ ] New UI uses Tailwind utility classes in `className`.
- [ ] No `styled-components` or `@emotion/*` imports were added.
- [ ] Shared UI tokens/classes (for example `signature-gradient`) were reused where applicable.

## Routing and Navigation
- [ ] Internal navigation uses React Router (`Link` / `navigate`) without page reload.

## Security and Data
- [ ] No hardcoded token/role/auth flags.
- [ ] API logic stays in service/api files, not large page JSX blocks.

## Verification
- [ ] Ran `npm run lint` locally.
- [ ] Ran `npm run build` locally (or confirmed unaffected).
- [ ] Added or updated tests when needed.
