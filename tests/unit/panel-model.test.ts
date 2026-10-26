import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FAN_SPEED_RANGE,
  TEMPERATURE_RANGE,
} from "../../src/features/panel/config.ts";
import {
  createInitialState,
  panelReducer,
  selectPanelSignals,
} from "../../src/features/panel/model.ts";

test("stopping removes simulated output and preserves operator preferences", () => {
  const configured = {
    ...createInitialState(),
    temperature: 26,
    fanSpeed: 80,
    ventilationEnabled: false,
    climateMode: "manual" as const,
  };
  const stopped = panelReducer(configured, { type: "stop" });
  assert.equal(
    configured.unitRunning,
    true,
    "reducer must not mutate its input",
  );
  assert.deepEqual(stopped, { ...configured, unitRunning: false });
  assert.equal(selectPanelSignals(stopped).airflow, 0);
  assert.equal(selectPanelSignals(stopped).climateRunning, false);
  const started = panelReducer(stopped, { type: "start" });
  assert.equal(
    selectPanelSignals(started).airflow,
    0,
    "a disabled fan preference must survive restart",
  );
  assert.equal(selectPanelSignals(started).climateRunning, true);
  assert.equal(started.temperature, 26);
  assert.equal(started.climateMode, "manual");
});

test("ventilation and HVAC enable commands are ignored while the unit is stopped", () => {
  const stopped = panelReducer(createInitialState(), { type: "stop" });
  assert.equal(
    panelReducer(stopped, { type: "set-ventilation", value: false }),
    stopped,
  );
  assert.equal(
    panelReducer(stopped, { type: "set-hvac", value: false }),
    stopped,
  );
  const prepared = panelReducer(stopped, {
    type: "set-temperature",
    value: 24,
  });
  assert.equal(
    prepared.temperature,
    24,
    "setpoints can be prepared before startup",
  );
});

test("numeric input is constrained and snapped at the shared state boundary", () => {
  const initial = createInitialState();
  assert.equal(
    panelReducer(initial, { type: "set-temperature", value: 200 }).temperature,
    TEMPERATURE_RANGE.max,
  );
  assert.equal(
    panelReducer(initial, { type: "set-temperature", value: -200 }).temperature,
    TEMPERATURE_RANGE.min,
  );
  assert.equal(
    panelReducer(initial, { type: "set-temperature", value: 23.4 }).temperature,
    23,
  );
  assert.equal(
    panelReducer(initial, { type: "set-fan-speed", value: 101 }).fanSpeed,
    FAN_SPEED_RANGE.max,
  );
  assert.equal(
    panelReducer(initial, { type: "set-fan-speed", value: -10 }).fanSpeed,
    FAN_SPEED_RANGE.min,
  );
  assert.equal(
    panelReducer(initial, { type: "set-fan-speed", value: 67 }).fanSpeed,
    65,
  );
  assert.equal(
    panelReducer(initial, { type: "set-fan-speed", value: 68 }).fanSpeed,
    70,
  );
});

test("invalid numeric input never enters panel state", () => {
  const initial = createInitialState();
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(
      panelReducer(initial, { type: "set-temperature", value }).temperature,
      initial.temperature,
    );
    assert.equal(
      panelReducer(initial, { type: "set-fan-speed", value }).fanSpeed,
      initial.fanSpeed,
    );
  }
});

test("HVAC and ventilation can be independently disabled without stopping the unit", () => {
  const initial = createInitialState();
  const noHvac = panelReducer(initial, { type: "set-hvac", value: false });
  assert.equal(selectPanelSignals(noHvac).fansRunning, true);
  assert.equal(selectPanelSignals(noHvac).climateRunning, false);
  const noFans = panelReducer(initial, {
    type: "set-ventilation",
    value: false,
  });
  assert.equal(selectPanelSignals(noFans).airflow, 0);
  assert.equal(selectPanelSignals(noFans).climateRunning, true);
});

test("acknowledgement persists through unit stop and reset restores a fresh session", () => {
  let state = panelReducer(createInitialState(), {
    type: "acknowledge-maintenance",
  });
  state = panelReducer(state, { type: "set-temperature", value: 28 });
  state = panelReducer(state, { type: "stop" });
  assert.equal(state.maintenanceAcknowledged, true);
  const reset = panelReducer(state, { type: "reset" });
  assert.deepEqual(reset, createInitialState());
  assert.notEqual(
    reset,
    createInitialState(),
    "each simulator session owns its own state object",
  );
  assert.equal(state.unitRunning, false);
});
