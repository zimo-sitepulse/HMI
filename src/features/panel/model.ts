import {
  DEMO_SIGNALS,
  FAN_SPEED_RANGE,
  TEMPERATURE_RANGE,
  type SetpointRange,
} from "./config.ts";

export type ClimateMode = "auto" | "manual";
export type UnitCommand = "start" | "stop" | "reset";

/** Preferences survive a unit stop. Actual operating states are derived, never stored twice. */
export interface PanelState {
  readonly unitRunning: boolean;
  readonly ventilationEnabled: boolean;
  readonly hvacEnabled: boolean;
  readonly climateMode: ClimateMode;
  readonly temperature: number;
  readonly fanSpeed: number;
  readonly maintenanceAcknowledged: boolean;
}

export type PanelAction =
  | { readonly type: UnitCommand }
  | { readonly type: "set-temperature"; readonly value: number }
  | { readonly type: "set-fan-speed"; readonly value: number }
  | { readonly type: "set-ventilation"; readonly value: boolean }
  | { readonly type: "set-hvac"; readonly value: boolean }
  | { readonly type: "set-climate-mode"; readonly value: ClimateMode }
  | { readonly type: "acknowledge-maintenance" };

export function createInitialState(): PanelState {
  return {
    unitRunning: true,
    ventilationEnabled: true,
    hvacEnabled: true,
    climateMode: "auto",
    temperature: TEMPERATURE_RANGE.initial,
    fanSpeed: FAN_SPEED_RANGE.initial,
    maintenanceAcknowledged: false,
  };
}

/** Clamp and snap at the state boundary, so every control uses the same accepted values. */
function normalizeSetpoint(
  value: number,
  range: SetpointRange,
  previous: number,
): number {
  if (!Number.isFinite(value)) return previous;
  const clamped = Math.min(range.max, Math.max(range.min, value));
  return (
    range.min + Math.round((clamped - range.min) / range.step) * range.step
  );
}

export function panelReducer(
  state: PanelState,
  action: PanelAction,
): PanelState {
  switch (action.type) {
    case "start":
      return { ...state, unitRunning: true };
    case "stop":
      return { ...state, unitRunning: false };
    case "reset":
      return createInitialState();
    case "set-temperature":
      return {
        ...state,
        temperature: normalizeSetpoint(
          action.value,
          TEMPERATURE_RANGE,
          state.temperature,
        ),
      };
    case "set-fan-speed":
      return {
        ...state,
        fanSpeed: normalizeSetpoint(
          action.value,
          FAN_SPEED_RANGE,
          state.fanSpeed,
        ),
      };
    case "set-ventilation":
      return state.unitRunning
        ? { ...state, ventilationEnabled: action.value }
        : state;
    case "set-hvac":
      return state.unitRunning
        ? { ...state, hvacEnabled: action.value }
        : state;
    case "set-climate-mode":
      return { ...state, climateMode: action.value };
    case "acknowledge-maintenance":
      return { ...state, maintenanceAcknowledged: true };
    default: {
      const unhandled: never = action;
      throw new Error(`Unhandled panel action: ${String(unhandled)}`);
    }
  }
}

/** Simulator output. A future PLC adapter must supply measured states independently of commands. */
export function selectPanelSignals(state: PanelState) {
  const fansRunning = state.unitRunning && state.ventilationEnabled;
  const climateRunning = state.unitRunning && state.hvacEnabled;
  return {
    fansRunning,
    climateRunning,
    airflow: fansRunning ? state.fanSpeed : 0,
    currentTemperature: (climateRunning
      ? DEMO_SIGNALS.cabinTemperatureActive
      : DEMO_SIGNALS.cabinTemperatureIdle
    ).toFixed(1),
  };
}
