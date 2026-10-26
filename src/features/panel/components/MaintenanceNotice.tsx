import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MaintenanceNotice({
  acknowledged,
  onAcknowledge,
}: {
  readonly acknowledged: boolean;
  readonly onAcknowledge: () => void;
}) {
  return (
    <Card className="maintenance-card compact-maintenance">
      <CardContent>
        <div className="maintenance-copy">
          <span
            className={`notice-icon ${acknowledged ? "is-acknowledged" : ""}`}
          >
            {acknowledged ? <Check size={22} /> : <Bell size={22} />}
          </span>
          <div>
            <h2>Inspect ventilation filter</h2>
            <p>
              {acknowledged
                ? "Notice acknowledged in this demo."
                : "Scheduled inspection of the supply air filter."}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          disabled={acknowledged}
          onClick={onAcknowledge}
        >
          <Check />
          {acknowledged ? "Acknowledged" : "Acknowledge"}
        </Button>
      </CardContent>
    </Card>
  );
}
