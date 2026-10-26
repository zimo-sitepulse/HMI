import { TemperatureControl } from "../components/SetpointControls";
import { FanSpeedControl } from "../components/SetpointControls";
import type { ScreenProps } from "../screen-props";

export function ComfortScreen({ panel }: ScreenProps) {
  return (
    <div className="climate-grid">
      <TemperatureControl panel={panel} />
      <FanSpeedControl panel={panel} />
    </div>
  );
}
