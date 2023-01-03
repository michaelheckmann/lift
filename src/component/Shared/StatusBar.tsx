import { useThemeMode } from "@rneui/themed";
import "config/firebase";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";

export default function StatusBar() {
  const { mode } = useThemeMode();
  return <ExpoStatusBar style={mode === "dark" ? "light" : "dark"} />;
}
