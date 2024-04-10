"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [state, setState] = useState("Hello world!");
  useEffect(() => setState("Bye world!"));

  return <div>{state}</div>;
}
