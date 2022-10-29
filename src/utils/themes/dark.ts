import { Colors } from "@rneui/themed";
import { RecursivePartial } from "@rneui/themed/dist/config/theme";
import { defaultTheme } from "./default";

const colors: RecursivePartial<Colors> = {
  primary: "#21a911",
  secondary: "#0c2461",
  success: "#22c55e",
  warning: "#eab308",
  white: "#f8fafc",
  black: "#0f172a",
  background: "#fff",
  disabled: "#d1d8e0",
  divider: "#d1d8e0",
  error: "#f43f5e",
  grey0: "#f1f5f9",
  grey1: "#e2e8f0",
  grey2: "#cbd5e1",
  grey3: "#94a3b8",
  grey4: "#64748b",
  grey5: "#475569",
  grey6: "#334155",
  grey7: "#1e293b",
  greyOutline: "#d1d8e0",
  searchBg: "",
};

export const darkTheme = {
  ...defaultTheme,
  colors,
};
