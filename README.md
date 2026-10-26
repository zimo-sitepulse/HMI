# WL Logging Unit · Touch HMI

A minimal, English-language touch panel for the Halliburton WL Logging Unit (RTL19-290). Built with React 19, TypeScript, Vite, Tailwind CSS 4 and local shadcn/ui components.

The primary display is **1024 × 600**. All eight screens fit without scrolling at that resolution; larger landscape panels and portrait devices have separate responsive layouts.

## Run locally

Use Node.js 22.13+ in the 22.x series, or Node.js 24+, and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open the address printed by Vite, normally [http://127.0.0.1:5173](http://127.0.0.1:5173). State resets when the page is reloaded. No environment variables or external services are required.

## Hosted demo

The live demo is published at [zimo-sitepulse.github.io/HMI/](https://zimo-sitepulse.github.io/HMI/).

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`. It runs the code checks, simulator tests and touch tests, builds the site and deploys the resulting `dist/` artifact to GitHub Pages. Deployments can also be started manually from the Actions tab. GitHub Pages must use **GitHub Actions** as its publishing source.

`npm run build:pages` builds with the `/HMI/` base path. Local development and `npm run build` keep `/`, so the normal local URL is unchanged. Public assets use `import.meta.env.BASE_URL`; do not introduce root-relative asset URLs that would bypass the project path. If the repository name or hosting path changes, update the Pages base in `vite.config.ts`.

The hosted site is the same browser-local simulator and has no physical PLC connection.

## Validate changes

Install Playwright's browser once:

```sh
npx playwright install chromium
```

Then run the complete local validation:

```sh
npm run validate
```

Useful individual commands:

| Command                               | Purpose                                                  |
| ------------------------------------- | -------------------------------------------------------- |
| `npm run check`                       | TypeScript, ESLint, formatting and CSS structure checks  |
| `npm run format`                      | Apply the repository's formatting rules                  |
| `npm run test:unit`                   | Simulator state, limits, stop/start and reset rules      |
| `npm run test:e2e`                    | Touch interaction, confirmation dialogs and viewport fit |
| `npm run build`                       | Typecheck and create the production build in `dist/`     |
| `npm run preview -- --host 127.0.0.1` | Serve the saved production build                         |

See [architecture and development patterns](docs/architecture.md) and [testing](docs/testing.md) before extending the panel.

## Screens

| Screen      | Purpose                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| Home        | Temperature, ventilation and power readings, with shortcuts to controls |
| Comfort     | Temperature and fan speed setpoints                                     |
| Start/Stop  | Confirmed unit start and stop commands                                  |
| Ventilation | Fan speed, enable preference and filter notice acknowledgement          |
| Fire & Gas  | Simulated smoke, gas and heat detector status                           |
| HVAC        | Temperature, enable preference and automatic/manual mode                |
| UPS/POWER   | Mains voltage, battery and frequency                                    |
| COMMISSION  | Unit identity, connection information and demo reset                    |

Start, stop and reset require confirmation. Disabled system switches cannot change preferences while the unit is stopped; setpoints and climate mode can still be prepared for the next start. Navigation preserves all settings.

## Simulation boundary

All signals and commands are local demonstrations. No PLC is connected. Climate mode is a stored preference; no control loop is executed. Fire and gas values do not implement a safety function. The simulator's output must be replaced by independently measured feedback before any physical integration; see [the integration notes](docs/architecture.md#future-plc-integration).

## Brand assets

The original red Halliburton logo is displayed at the top of the left menu. The Rogaland Teknikk asset is retained locally for future use but is not displayed. The files are bundled so runtime does not depend on external image hosts.

- `public/halliburton.svg`: [Halliburton](https://www.halliburton.com/).
- `public/rogaland-teknikk.png`: [Rogaland Teknikk](https://www.rogalandteknikk.no/).

The logos remain the property of their respective owners.
