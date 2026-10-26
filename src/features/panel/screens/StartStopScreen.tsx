import { Power, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Status } from "../components/Status";
import type { ScreenProps } from "../screen-props";

export function StartStopScreen({ panel, onRequestCommand }: ScreenProps) {
  const { unitRunning } = panel.state;
  return (
    <Card className="start-stop-card">
      <CardContent>
        <div className="start-stop-symbol">
          <Power size={42} strokeWidth={1.5} />
        </div>
        <h2>{unitRunning ? "Unit is running" : "Unit is stopped"}</h2>
        <p>Unit control for ventilation and climate.</p>
        <div className="start-stop-actions">
          <Button
            disabled={unitRunning}
            onClick={() => onRequestCommand("start")}
          >
            <Power />
            Start unit
          </Button>
          <Button
            variant="outline"
            className="stop-command"
            disabled={!unitRunning}
            onClick={() => onRequestCommand("stop")}
          >
            <Square />
            Stop unit
          </Button>
        </div>
        <Status neutral={!unitRunning}>
          {unitRunning ? "Systems enabled" : "Systems on standby"}
        </Status>
      </CardContent>
    </Card>
  );
}
