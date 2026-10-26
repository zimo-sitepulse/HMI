import { Bell, Power, ShieldCheck, Thermometer, Wind, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Status } from "../components/Status";
import { MetricCard } from "../components/MetricCard";
import { DEMO_SIGNALS } from "../config";
import type { ScreenProps } from "../screen-props";

export function HomeScreen({ panel, onNavigate }: ScreenProps) {
  const { temperature, maintenanceAcknowledged } = panel.state;
  const { fansRunning, currentTemperature, airflow } = panel.signals;
  return (
    <div className="page-stack">
      <div className="metric-grid">
        <MetricCard
          title="Temperature"
          action="Adjust comfort"
          value={currentTemperature}
          unit="°C"
          detail={`Setpoint ${temperature} °C`}
          icon={Thermometer}
          onClick={() => onNavigate("comfort")}
        />
        <MetricCard
          title="Ventilation"
          action="Open ventilation"
          value={airflow}
          unit="%"
          detail={fansRunning ? "Supply and extract running" : "Fans stopped"}
          icon={Wind}
          onClick={() => onNavigate("ventilation")}
        />
        <MetricCard
          title="UPS battery"
          action="View power"
          value={DEMO_SIGNALS.batteryPercent}
          unit="%"
          detail={`Power supply ${DEMO_SIGNALS.mainsVoltage} V`}
          icon={Zap}
          onClick={() => onNavigate("power")}
        />
      </div>
      <div className="home-safety">
        <div className="home-safety-label">
          <ShieldCheck size={23} />
          <span>Fire & gas</span>
          <Status>Normal</Status>
        </div>
        <Button variant="ghost" onClick={() => onNavigate("fire-gas")}>
          View detectors
        </Button>
      </div>
      <div className="home-actions">
        {!maintenanceAcknowledged && (
          <Button
            variant="ghost"
            className="notice-action"
            onClick={() => onNavigate("ventilation")}
          >
            <Bell />
            <span>View filter notice</span>
          </Button>
        )}
        <Button
          variant="outline"
          className="unit-command"
          onClick={() => onNavigate("start-stop")}
        >
          <Power />
          Open unit controls
        </Button>
      </div>
    </div>
  );
}
