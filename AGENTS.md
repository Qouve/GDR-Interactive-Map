# Repository guidelines

## Styling

- Keep every JSX/TSX `className` at a maximum of five class tokens.
- Prefer one descriptive, semantic class per element (for example `sidebar-header`)
  and implement its presentation in `src/index.css`.
- Put complex selectors and variants such as `data-[state=checked]`,
  `data-[orientation=horizontal]`, responsive breakpoints, pseudo-elements, and
  multi-property component states in CSS instead of JSX.
- Tailwind remains available for small, simple adjustments, but do not build
  long utility-class strings in components.
