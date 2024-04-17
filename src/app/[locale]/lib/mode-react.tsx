import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Mode, ModeManager, Theme } from "./mode";

export interface ModeContextType {
  mode: Mode;
  theme: Theme;
  setMode(mode: Mode): void;
}
export const ModeContext = createContext<ModeContextType>(
  {} as unknown as ModeContextType
);

export interface ModeContextProviderProps extends PropsWithChildren {
  variableName: string;
}

export function ModeContextProvider({
  children,
  variableName,
}: ModeContextProviderProps) {
  const modeManager: ModeManager = (window as any)[variableName];
  const [mode, setMode] = useState(() => modeManager.getMode());
  const [theme, setTheme] = useState(() => modeManager.getTheme());

  const setModeExternal = useCallback(
    (mode: Mode) => {
      if (modeManager) modeManager.setMode(mode);
    },
    [modeManager]
  );

  useEffect(() => modeManager.watchMode(setMode), [modeManager]);
  useEffect(() => modeManager.watchTheme(setTheme), [modeManager]);

  return (
    <ModeContext.Provider
      value={useMemo(
        () => ({ mode, theme, setMode: setModeExternal }),
        [mode, theme, setModeExternal]
      )}
    >
      {children}
    </ModeContext.Provider>
  );
}

export type { Mode, ModeManager, Theme } from "./mode";
