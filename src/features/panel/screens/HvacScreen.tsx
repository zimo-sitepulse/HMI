import { SystemToggle } from "../components/SystemToggle";
import { Snowflake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TemperatureControl } from "../components/SetpointControls";
import { ClimateModeControl } from "../components/ClimateModeControl";
import type { ScreenProps } from "../screen-props";

export function HvacScreen({ panel }: ScreenProps) {
  const { unitRunning, hvacEnabled } = panel.state;
  const { climateRunning } = panel.signals;
  const { dispatch } = panel;
  return (
    <div className="climate-grid">
      <TemperatureControl panel={panel} />
      <Card className="control-card hvac-card">
        <CardContent>
          <div className="section-heading">
            <Snowflake size={22} />
            <h2>Climate control</h2>
          </div>
          <SystemToggle
            id="hvac-label"
            label="HVAC enabled"
            description={
              !unitRunning
                ? "Start the unit to enable climate."
                : climateRunning
                  ? "Climate running"
                  : "Climate stopped"
            }
            checked={hvacEnabled}
            disabled={!unitRunning}
            onChange={(value) => dispatch({ type: "set-hvac", value })}
          />
          <ClimateModeControl panel={panel} />
        </CardContent>
      </Card>
    </div>
  );
}
