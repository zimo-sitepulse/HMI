import { Switch } from "@/components/ui/switch";

interface SystemToggleProps {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly showStateText?: boolean;
  readonly className?: string;
}

/** The switch represents a preference; the adjacent description reports simulated operation. */
export function SystemToggle({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
  showStateText = false,
  className = "",
}: SystemToggleProps) {
  return (
    <div className={`system-row${className ? ` ${className}` : ""}`}>
      <div className="system-description">
        <h2 id={id}>{label}</h2>
        <p>{description}</p>
      </div>
      <div className="switch-control">
        {showStateText && (
          <span aria-hidden="true">{checked ? "ON" : "OFF"}</span>
        )}
        <Switch
          aria-labelledby={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onChange}
        />
      </div>
    </div>
  );
}
