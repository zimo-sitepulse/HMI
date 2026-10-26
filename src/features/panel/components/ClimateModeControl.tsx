import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PanelController } from "../usePanel";

export function ClimateModeControl({
  panel,
}: {
  readonly panel: PanelController;
}) {
  return (
    <div className="mode-row">
      <div>
        <h2>Climate mode</h2>
        {!panel.signals.climateRunning && (
          <p>Applies when climate is enabled.</p>
        )}
      </div>
      <ToggleGroup
        type="single"
        value={panel.state.climateMode}
        onValueChange={(value) => {
          // Radix can emit an empty value when the selected item is pressed again.
          if (value === "auto" || value === "manual")
            panel.dispatch({ type: "set-climate-mode", value });
        }}
        variant="outline"
        aria-label="Climate mode"
        className="mode-toggle"
      >
        <ToggleGroupItem value="auto">Automatic</ToggleGroupItem>
        <ToggleGroupItem value="manual">Manual</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
