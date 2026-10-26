import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UNIT } from "../config";
import type { ScreenProps } from "../screen-props";

export function CommissionScreen({ onRequestCommand }: ScreenProps) {
  return (
    <div className="page-stack">
      <dl className="settings-list">
        <div>
          <dt>Unit</dt>
          <dd>{UNIT.name}</dd>
        </div>
        <div>
          <dt>Reference</dt>
          <dd>{UNIT.reference}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>
            <Badge variant="secondary">{UNIT.environment}</Badge>
          </dd>
        </div>
        <div>
          <dt>PLC connection</dt>
          <dd>Not connected</dd>
        </div>
      </dl>
      <div className="reset-row">
        <div>
          <h2>Reset demo</h2>
          <p>Restore settings and notices to their defaults.</p>
        </div>
        <Button variant="outline" onClick={() => onRequestCommand("reset")}>
          <RotateCcw />
          Reset
        </Button>
      </div>
    </div>
  );
}
