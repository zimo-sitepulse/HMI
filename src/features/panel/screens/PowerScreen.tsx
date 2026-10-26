import { Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Status } from "../components/Status";
import { POWER_READINGS } from "../config";

export function PowerScreen() {
  return (
    <div className="page-stack">
      <div className="power-grid">
        {POWER_READINGS.map((reading) => (
          <Card className="power-card" key={reading.label}>
            <CardContent>
              <div className="metric-title">
                <Zap size={21} />
                <span>{reading.label}</span>
              </div>
              <div className="metric-value">
                {reading.value}
                <span>{reading.unit}</span>
              </div>
              <Status>{reading.detail}</Status>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="overview-status">
        <span>Power system</span>
        <Status>Normal</Status>
      </div>
    </div>
  );
}
