"use client";

import { PropsWithChildren } from "react";

export function ThisIsClientComponent({ children }: PropsWithChildren) {
  return <>{children}</>;
}
