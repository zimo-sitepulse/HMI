import { ArrowRight, Power, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UnitCommand } from "@/features/panel/model";

const COMMAND_COPY = {
  start: {
    title: "Start the unit?",
    description:
      "The unit will start with your selected ventilation and climate settings.",
    action: "Start unit",
    icon: Power,
  },
  stop: {
    title: "Stop the unit?",
    description:
      "Ventilation and climate will stop. Your settings will be kept.",
    action: "Stop unit",
    icon: Power,
  },
  reset: {
    title: "Reset the demo?",
    description: "All values and notices will return to their defaults.",
    action: "Reset",
    icon: RotateCcw,
  },
} satisfies Record<
  UnitCommand,
  { title: string; description: string; action: string; icon: typeof Power }
>;

export function CommandDialog({
  command,
  onCancel,
  onConfirm,
}: {
  readonly command: UnitCommand | null;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}) {
  // Keep closed content mounted for Radix's exit animation; no command can run when closed.
  const copy = COMMAND_COPY[command ?? "stop"];
  const Icon = copy.icon;
  return (
    <AlertDialog
      open={command !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent className="command-dialog">
        <AlertDialogHeader>
          <div className="dialog-icon">
            <Icon size={28} />
          </div>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.description} This only affects the simulator.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {copy.action}
            <ArrowRight />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
