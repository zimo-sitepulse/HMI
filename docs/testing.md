# Testing and validation

## Local commands

`npm run validate` runs static checks, tests and a production build. It needs Node.js 22.13+ in the 22.x series or Node.js 24+, and a Playwright Chromium installation.

```sh
npm ci
npx playwright install chromium
npm run validate
```

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select an existing Chromium executable. On Linux, the test configuration also detects `/usr/bin/chromium`. Tests run against a separate Vite server on port 4173; the interactive preview normally uses port 5173.

## Fast model tests

`npm run test:unit` uses Node's built-in test runner and native TypeScript stripping. There is no DOM and no additional unit-test framework. Relative imports in the pure model use `.ts` extensions so Node can run them directly.

The tests protect behaviour rather than component structure:

- Stopping removes output while preserving operator preferences.
- Restart honours disabled systems and previously selected values.
- Enable/disable commands cannot bypass the stopped-unit interlock.
- Numeric input is clamped, snapped and protected against `NaN` and infinity.
- HVAC and ventilation can be operated independently.
- Acknowledgement survives stop/start, while reset creates a clean session.

When a state transition changes, add a test for the operator-visible outcome or invariant. Do not copy the reducer's switch statement into the test.

## Browser tests

`npm run test:e2e` runs `tests/*.spec.ts` in Chromium with touch input enabled. Playwright explicitly excludes the Node unit tests by matching only `.spec.ts` files.

The browser suite covers all eight menu entries, local logo loading, state shared across screens, setpoint boundaries, acknowledgement, reset, disabled systems and command confirmations. The confirmation flow is exercised at 1024 × 600, including cancel and Escape.

The primary display has explicit minimum-target checks for every visible button, including mode radios and switches. Layout checks measure document dimensions and assert controls are entirely within the viewport; overflow is not hidden to make tests pass.

No-scroll coverage includes 1024 × 600, 1024 × 768 and 1280 × 720, plus the 1280 × 800 panel test. Narrow portrait views are checked for accessible navigation and no horizontal overflow; vertical reflow is intentional there.

## Static checks

- TypeScript checks source, configuration and tests with strict typing, unused code checks and exhaustive screen/action mappings.
- ESLint checks TypeScript and React hook rules with zero warnings allowed.
- Prettier provides one formatting configuration for code and documentation.
- The CSS structure checker prevents repeated selectors/properties in a scope.

Use `npm run check` for the static checks and `npm run format` to apply formatting.

## Visual review

For a layout change, inspect all affected screens at 1024 × 600, then check a larger landscape screen and a narrow portrait view. Inspect a confirmation dialog and disabled/running states too. A passing geometry test cannot establish that the panel is readable on the physical display.

The structural refactor was compared against saved pre-refactor snapshots of all eight screens at four viewport sizes. Text, element geometry, fonts, colours, spacing and borders matched in all 32 comparisons. Those temporary migration captures are not a maintained screenshot-baseline system; the automated browser tests described above are the ongoing regression checks.

## Scope

These tests validate a simulator and its user interface. They do not validate detector hardware, PLC communications, actual control loops or a safety function.
