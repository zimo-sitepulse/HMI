# Rogaland Teknikk · WL Logging Unit HMI

An interactive React + TypeScript showcase for a touch-operated PLC panel, based on the supplied Halliburton WL Logging Unit (RTL19-290) reference. Includes Home, Comfort, Start / Stop, Ventilation, Fire & Gas, HVAC, UPS / Power and Commission pages.

## Run

Node.js 22.12+ or 24 and npm are required.

```sh
npm ci --cache /tmp/hmi-npm-cache
npm run dev
```

```sh
npm run build
npm test
```

Tests use Chromium at `/usr/bin/chromium` when available. Otherwise run `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chromium executable.

The primary touch layout targets 1280 × 800 landscape, with controls at least 52 px tall. Smaller screens reflow. The interface uses English, following the supplied operator panel. Start/stop commands require confirmation. Local state resets on page reload.

## Simulation and PLC integration

All readings, states, detector statuses and commands are browser-local demonstrations. There is no physical PLC connection. The Fire & Gas screen does not implement a safety function. A production integration requires the controller type, protocol (for example OPC UA through a gateway), signal list, command feedback and interlock requirements. The equipment illustration is a concept, not an engineering drawing.

## Brand assets

Official assets downloaded from references on the companies' own websites on 2026-10-26, stored locally so runtime does not depend on external hosts:

- Rogaland Teknikk: https://www.rogalandteknikk.no/ → https://cdn.prod.website-files.com/5c51b2503dcfd30c8e0987bf/5c51b3f33dcfd31a40098a2c_rogaland%20teknikk.png
- Halliburton: https://www.halliburton.com/ → https://cdn.brandfolder.io/3I2CY2XL/as/vkc5w586w5gtr898396p3w/halliburton-logo.svg

Company logos remain the property of their respective owners.
