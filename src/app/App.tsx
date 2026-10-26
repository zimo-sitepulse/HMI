import { useState, type ComponentType } from "react";
import type { UnitCommand } from "@/features/panel/model";
import type { PageId } from "@/features/panel/navigation";
import type { ScreenProps } from "@/features/panel/screen-props";
import { usePanel } from "@/features/panel/usePanel";
import { CommissionScreen } from "@/features/panel/screens/CommissionScreen";
import { ComfortScreen } from "@/features/panel/screens/ComfortScreen";
import { FireGasScreen } from "@/features/panel/screens/FireGasScreen";
import { HomeScreen } from "@/features/panel/screens/HomeScreen";
import { HvacScreen } from "@/features/panel/screens/HvacScreen";
import { PowerScreen } from "@/features/panel/screens/PowerScreen";
import { StartStopScreen } from "@/features/panel/screens/StartStopScreen";
import { VentilationScreen } from "@/features/panel/screens/VentilationScreen";
import { CommandDialog } from "./CommandDialog";
import { PanelLayout } from "./PanelLayout";

/** Exhaustive mapping: a navigation ID cannot be added without implementing its screen. */
const SCREENS = {
  home: HomeScreen,
  comfort: ComfortScreen,
  "start-stop": StartStopScreen,
  ventilation: VentilationScreen,
  "fire-gas": FireGasScreen,
  hvac: HvacScreen,
  power: PowerScreen,
  commission: CommissionScreen,
} satisfies Record<PageId, ComponentType<ScreenProps>>;

export function App() {
  const panel = usePanel();
  const [page, setPage] = useState<PageId>("home");
  const [command, setCommand] = useState<UnitCommand | null>(null);
  const Screen = SCREENS[page];

  function navigate(next: PageId) {
    setPage(next);
    window.scrollTo(0, 0);
  }
  function confirmCommand() {
    if (command === null) return;
    panel.dispatch({ type: command });
    if (command === "reset") navigate("home");
    setCommand(null);
  }

  return (
    <>
      <PanelLayout
        page={page}
        unitRunning={panel.state.unitRunning}
        maintenanceAcknowledged={panel.state.maintenanceAcknowledged}
        onNavigate={navigate}
      >
        <Screen
          panel={panel}
          onNavigate={navigate}
          onRequestCommand={setCommand}
        />
      </PanelLayout>
      <CommandDialog
        command={command}
        onCancel={() => setCommand(null)}
        onConfirm={confirmCommand}
      />
    </>
  );
}
