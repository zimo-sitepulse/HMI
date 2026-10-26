import {
  Fan,
  Flame,
  Home,
  Power,
  Settings2,
  Snowflake,
  Thermometer,
  Zap,
} from "lucide-react";

/** Stable IDs are used in logic; operator-facing labels can change independently. */
export const NAVIGATION = [
  { id: "home", label: "Home", icon: Home },
  { id: "comfort", label: "Comfort", icon: Thermometer },
  { id: "start-stop", label: "Start/Stop", icon: Power },
  { id: "ventilation", label: "Ventilation", icon: Fan },
  { id: "fire-gas", label: "Fire & Gas", icon: Flame },
  { id: "hvac", label: "HVAC", icon: Snowflake },
  { id: "power", label: "UPS/POWER", icon: Zap },
  { id: "commission", label: "COMMISSION", icon: Settings2 },
] as const;

export type PageId = (typeof NAVIGATION)[number]["id"];
