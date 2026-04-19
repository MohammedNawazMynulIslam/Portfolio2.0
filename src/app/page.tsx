"use client";

import { useState } from "react";

import { Desktop } from "@/components/Desktop";
import { WelcomeScreen } from "@/components/WelcomeScreen";

export default function Home() {
  const [showDesktop, setShowDesktop] = useState(false);

  return showDesktop ? (
    <Desktop />
  ) : (
    <WelcomeScreen onComplete={() => setShowDesktop(true)} />
  );
}
