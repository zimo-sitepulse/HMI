import type { UnitCommand } from "./model";
import type { PageId } from "./navigation";
import type { PanelController } from "./usePanel";

export interface ScreenProps {
  readonly panel: PanelController;
  readonly onNavigate: (page: PageId) => void;
  readonly onRequestCommand: (command: UnitCommand) => void;
}
