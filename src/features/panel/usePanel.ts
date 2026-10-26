import { useReducer } from "react";
import { createInitialState, panelReducer, selectPanelSignals } from "./model";

/** One owner for simulation state, shared by every screen. No persistence or physical commands. */
export function usePanel() {
  const [state, dispatch] = useReducer(
    panelReducer,
    undefined,
    createInitialState,
  );
  return { state, signals: selectPanelSignals(state), dispatch };
}

export type PanelController = ReturnType<typeof usePanel>;
