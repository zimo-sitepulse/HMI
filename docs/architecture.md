# Architecture and development patterns

## Ownership

```text
src/
  main.tsx                         Browser bootstrap and global style imports
  app/
    App.tsx                        Navigation, screen registry and pending commands
    PanelLayout.tsx                Sidebar, header, page heading and footer
    CommandDialog.tsx              One confirmation flow for start, stop and reset
  features/panel/
    config.ts                      Unit identity, limits and fixed demo readings
    model.ts                       Pure state transitions and derived simulator signals
    usePanel.ts                    React ownership of the model
    navigation.ts                  Stable page IDs, operator labels and icons
    screen-props.ts                Screen contract
    components/                    Shared panel controls and status displays
    screens/                       One small component per operator page
  components/ui/                   Local shadcn/Radix primitives
  styles/
    theme.css                      Palette and shadcn theme mappings
    panel.css                      One base definition per selector
    responsive.css                 One block per responsive condition
  style.css                        Explicit CSS import order only
```

`App` owns one `usePanel` instance. Changing screens does not recreate that state. Navigation and pending confirmations are UI state and stay in `App`; they do not belong in the simulator reducer.

Screens receive the typed panel controller and callbacks through `ScreenProps`. No screen creates its own simulator. The panel is small enough that context, an external state store and a URL router would add indirection without solving a current requirement.

## State and commands

The event path is:

```text
Touch control → typed action → panelReducer → PanelState → selectPanelSignals → screen
```

`PanelState` stores operator preferences and unit enablement. `selectPanelSignals` derives actual simulated operation. For example, `ventilationEnabled` can remain true while `unitRunning` is false; airflow is then zero. Do not store another `fansRunning` boolean in state, since it could contradict those inputs.

`model.ts` has no React, browser, routing or I/O dependencies. This makes its rules directly testable with Node's built-in test runner. It returns new state objects and never mutates its input.

Numeric values are validated at the reducer boundary as well as constrained by the UI. Non-finite values retain the previous setpoint. Values outside the allowed range are clamped and snapped to the configured step. Limits and initial values are defined once in `config.ts`.

Unit start, stop and reset have two steps: a screen requests a `UnitCommand`, then `CommandDialog` asks for confirmation. Only `App.confirmCommand` dispatches it. Cancel and Escape close the dialog without dispatching. Reset creates a fresh simulator state and returns to Home.

System enable/disable actions are ignored by the reducer while the unit is stopped, matching the disabled UI. Setpoints and climate mode remain editable. Stopping preserves preferences; acknowledgement persists until a reset or page reload.

## Shared controls

- `SetpointControl` owns the common card markup. `TemperatureControl` and `FanSpeedControl` provide the appropriate range, feedback and action. All screens use these same components.
- `Stepper` handles touch interaction and button limits; it does not own a copy of the setpoint.
- `SystemToggle` presents a preference switch alongside its operating description. An enabled preference is not treated as measured feedback.
- `ClimateModeControl` validates the string emitted by Radix before dispatching. Empty selection events do not erase the current mode.
- `MaintenanceNotice`, `Status` and `MetricCard` are presentational components. They receive values and callbacks and do not create model state.

Extract components when markup or behaviour is actually shared. A unique screen does not need a generic schema or a configurable form framework. Keep the DOM structure in the screen when that is easier to understand.

## Navigation

Page IDs such as `start-stop` are stable identifiers; text such as `Start/Stop` is operator-facing copy. Business logic must not compare translated or edited labels.

`navigation.ts` determines menu order. `App.tsx` has an exhaustive `Record<PageId, ComponentType<ScreenProps>>`, so adding a menu item without implementing its screen fails typechecking.

To add a screen:

1. Create a focused screen component under `screens/`.
2. Add its stable ID, label and icon to `NAVIGATION`.
3. Add the component to `SCREENS` in `App.tsx`.
4. Update the expected operator menu in the end-to-end test and verify fit at 1024 × 600.

## Styling ownership

Tailwind remains the styling foundation for the local shadcn primitives. Custom CSS owns the panel's composition, touch sizing and viewport profiles. Both use the palette from `theme.css`.

Import order is deliberate: Tailwind, animation utilities, theme, base panel styles, responsive overrides. Panel styles are unlayered so the touch adaptations take precedence over the generated primitive utilities. Do not add a second Tailwind utility that silently competes with a panel-owned property.

Use these rules when changing styles:

1. Change a shared colour in `theme.css` rather than repeating its hex value.
2. Change base component styling in the existing selector in `panel.css`.
3. Change viewport-specific values inside the existing media condition in `responsive.css`.
4. Keep the dedicated 1024 × 600 profile after general viewport conditions. Reduced-motion preferences remain last.
5. Do not append a later copy of a selector to override an earlier design iteration.

`npm run check:styles` rejects repeated selectors within the same condition and repeated properties in a rule. An intentional override belongs in a different responsive scope, not a duplicate base definition. Shorthand and longhand rules still need review: the checker is a structural guard, not a full CSS correctness proof.

At 1024 × 600, the layout preserves a 56 px minimum target, 72 × 72 px stepper buttons, 80 px start/stop buttons, 96 × 56 px switches and 72 px confirmation actions. Fit is achieved by layout and spacing, not by hiding overflowing content.

The local `components/ui/` files are shadcn source, not an opaque installed component library. They use direct Radix package imports so unused primitives are not pulled into the module graph. Review generated changes when updating these files. Touch adaptations belong in the panel stylesheet unless the change applies to the primitive everywhere.

## Future PLC integration

The current reducer is a browser-local simulator, not a PLC command transport. No physical integration is implemented.

A future adapter must separate commands, pending command status and independently measured feedback. In particular, sending a start command must not immediately set a measured `running` flag. The adapter needs connection state, stale/invalid signal handling, command acknowledgement and error reporting before the UI can represent real equipment truthfully.

Keep transport subscriptions and network I/O out of screen components and out of the pure reducer. Preserve the presentational controls, supply measured signals through an explicit controller boundary, and add integration tests for that adapter. Do not reuse the fixed `DEMO_SIGNALS` as production fallback readings.
