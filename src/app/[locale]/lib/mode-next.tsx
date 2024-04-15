"use client";

import dynamic from "next/dynamic";
import { ModeContextProvider as BrowserOnlyModeContextProvider } from "./mode-react";

export const ModeContextProvider = dynamic(
  () => Promise.resolve(BrowserOnlyModeContextProvider),
  { ssr: false }
);

export { ModeContext } from "./mode-react";

export type { Mode, ModeManager, Theme } from "./mode-react";
