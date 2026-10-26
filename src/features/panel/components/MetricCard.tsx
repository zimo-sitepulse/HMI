import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MetricCard({
  title,
  value,
  unit,
  detail,
  icon: Icon,
  action,
  onClick,
}: {
  title: string;
  value: string | number;
  unit: string;
  detail: string;
  icon: LucideIcon;
  action: string;
  onClick: () => void;
}) {
  return (
    <section
      className="metric-card"
      role="group"
      aria-label={`${title} reading`}
    >
      <div className="metric-title">
        <Icon size={21} strokeWidth={1.7} />
        <span>{title}</span>
      </div>
      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>
      <p>{detail}</p>
      <Button variant="ghost" className="metric-action" onClick={onClick}>
        {action}
      </Button>
    </section>
  );
}
