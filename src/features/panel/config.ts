/** Unit identity and demo signals are kept separate from editable operator preferences. */
export const UNIT = {
  name: "WL Logging Unit",
  reference: "RTL19-290",
  panel: "OP–01",
  environment: "Local simulator",
} as const;

export interface SetpointRange {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly initial: number;
}

export const TEMPERATURE_RANGE = {
  min: 16,
  max: 28,
  step: 1,
  initial: 22,
} as const satisfies SetpointRange;
export const FAN_SPEED_RANGE = {
  min: 20,
  max: 100,
  step: 5,
  initial: 65,
} as const satisfies SetpointRange;

/** These are fixed showcase readings, not measurements from a controller. */
export const DEMO_SIGNALS = {
  cabinTemperatureActive: 21.8,
  cabinTemperatureIdle: 20.6,
  mainsVoltage: 230,
  batteryPercent: 98,
  frequency: 50,
} as const;

export const DETECTORS = [
  { name: "Smoke detector", tag: "SD-01" },
  { name: "Gas detector", tag: "GD-01" },
  { name: "Heat detector", tag: "HD-01" },
] as const;

export const POWER_READINGS = [
  {
    label: "Mains supply",
    value: String(DEMO_SIGNALS.mainsVoltage),
    unit: "V",
    detail: "Supply available",
  },
  {
    label: "UPS battery",
    value: String(DEMO_SIGNALS.batteryPercent),
    unit: "%",
    detail: "Battery healthy",
  },
  {
    label: "Frequency",
    value: DEMO_SIGNALS.frequency.toFixed(1),
    unit: "Hz",
    detail: "Within normal range",
  },
] as const;
