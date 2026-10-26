import { SystemToggle } from "../components/SystemToggle";
import { MaintenanceNotice } from "../components/MaintenanceNotice";
import { Fan } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Status } from "../components/Status";
import { FanSpeedControl } from "../components/SetpointControls";
import type { ScreenProps } from "../screen-props";

export function VentilationScreen({ panel }: ScreenProps) {
  const { unitRunning, ventilationEnabled, fanSpeed, maintenanceAcknowledged } =
    panel.state;
  const { fansRunning } = panel.signals;
  const { dispatch } = panel;
  return (
    <div className="page-stack">
      <div className="climate-grid">
        <FanSpeedControl panel={panel} />
        <Card className="control-card">
          <CardContent>
            <div className="section-heading">
              <Fan size={22} />
              <h2>Supply & extract</h2>
            </div>
            <SystemToggle
              id="vent-label"
              label="Ventilation"
              description={
                !unitRunning
                  ? "Start the unit to enable fans."
                  : fansRunning
                    ? `Fans running · ${fanSpeed} %`
                    : "Fans stopped"
              }
              checked={ventilationEnabled}
              disabled={!unitRunning}
              onChange={(value) => dispatch({ type: "set-ventilation", value })}
              showStateText
              className="fan-enable"
            />
            <div className="control-foot">
              <span>Supply and extract fans</span>
              <Status neutral={!fansRunning}>
                {fansRunning ? "Running" : "Stopped"}
              </Status>
            </div>
          </CardContent>
        </Card>
      </div>
      <MaintenanceNotice
        acknowledged={maintenanceAcknowledged}
        onAcknowledge={() => dispatch({ type: "acknowledge-maintenance" })}
      />
    </div>
  );
}
