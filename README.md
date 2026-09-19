# Gods, Death & Reapers Interactive Map

An interactive community map for Gods, Death & Reapers. The application is built with
React, TypeScript, Tailwind CSS, shadcn/ui components, and React Leaflet.

## Development

```bash
pnpm install
pnpm run dev
```

Before committing:

```bash
pnpm run lint
pnpm run build
```

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the `main` branch and
publishes the contents of `dist`. In the repository settings, select
**GitHub Actions** as the source under **Pages → Build and deployment** once.

## World data

- Midgard supports Standard and Unstable modes.
- Helheim supports Standard and Unstable modes.
- Asgard data remains in the repository, but the world is disabled in the UI.
