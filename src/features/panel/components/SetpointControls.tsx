import { Fan, Thermometer, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FAN_SPEED_RANGE,
  TEMPERATURE_RANGE,
  type SetpointRange,
} from "../config";
import type { PanelController } from "../usePanel";
import { Status } from "./Status";
import { Stepper } from "./Stepper";

interface SetpointControlProps {
  readonly title: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly value: number;
  readonly unit: string;
  readonly range: SetpointRange;
  readonly onChange: (value: number) => void;
  readonly feedback: ReactNode;
}

/** Shared markup keeps Comfort, HVAC and Ventilation touch controls in sync. */
function SetpointControl({
  title,
  label,
  icon: Icon,
  value,
  unit,
  range,
  onChange,
  feedback,
}: SetpointControlProps) {
  return (
    <Card className="control-card">
      <CardContent>
        <div className="section-heading">
          <Icon size={22} />
          <h2>{title}</h2>
        </div>
        <p className="control-caption">Target</p>
        <Stepper
          label={label}
          value={value}
          unit={unit}
          min={range.min}
          max={range.max}
          step={range.step}
          onChange={onChange}
        />
        <div className="control-foot">
          {feedback}
          <span>{`${range.min}–${range.max} ${unit}`}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TemperatureControl({
  panel,
}: {
  readonly panel: PanelController;
}) {
  return (
    <SetpointControl
      title="Temperature"
      label="temperature"
      icon={Thermometer}
      value={panel.state.temperature}
      unit="°C"
      range={TEMPERATURE_RANGE}
      onChange={(value) => panel.dispatch({ type: "set-temperature", value })}
      feedback={<span>Measured {panel.signals.currentTemperature} °C</span>}
    />
  );
}

export function FanSpeedControl({
  panel,
}: {
  readonly panel: PanelController;
}) {
  return (
    <SetpointControl
      title="Fan speed"
      label="fan speed"
      icon={Fan}
      value={panel.state.fanSpeed}
      unit="%"
      range={FAN_SPEED_RANGE}
      onChange={(value) => panel.dispatch({ type: "set-fan-speed", value })}
      feedback={
        <Status neutral={!panel.signals.fansRunning}>
          {panel.signals.fansRunning ? "Running" : "Stopped"}
        </Status>
      }
    />
  );
}
