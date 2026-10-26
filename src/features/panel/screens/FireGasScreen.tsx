import { CircleCheck, ShieldCheck } from "lucide-react";
import { Status } from "../components/Status";
import { DETECTORS } from "../config";

export function FireGasScreen() {
  return (
    <div className="page-stack">
      <div className="alarm-summary">
        <ShieldCheck size={27} strokeWidth={1.6} />
        <div>
          <h2>No active alarms</h2>
          <p>All detectors report normal status.</p>
        </div>
      </div>
      <div className="system-list">
        {DETECTORS.map((detector) => (
          <div className="system-row detector-row" key={detector.tag}>
            <div className="system-icon">
              <ShieldCheck />
            </div>
            <div className="system-description">
              <h2>{detector.name}</h2>
              <p>{detector.tag}</p>
            </div>
            <Status>Normal</Status>
            <CircleCheck className="system-check" size={25} />
          </div>
        ))}
      </div>
      <p className="quiet-note">
        Simulated detector states. No physical monitoring.
      </p>
    </div>
  );
}
