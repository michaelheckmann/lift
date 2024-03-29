import { Colors, ThemeSpacing } from "@rneui/themed";
import { RecursivePartial } from "@rneui/themed/dist/config/theme";
import { Themes } from "../types/Settings";

const themeName: Themes = "light";

const colors: RecursivePartial<Colors> = {
  primary: "#151616",
  primary50: "#f6f7f7",
  primary100: "#e3e4e4",
  primary200: "#c6c9c9",
  primary300: "#a1a7a6",
  primary400: "#7d8483",
  primary500: "#636968",
  primary600: "#4e5353",
  primary700: "#414444",
  primary800: "#363939",
  primary900: "#151616",

  background: "#fafafa",
  foreground: "#f4f4f5",
  border: "#a1a1aa",
  text: "#18181b",

  gray50: "#fafafa",
  gray100: "#f4f4f5",
  gray200: "#e4e4e7",
  gray300: "#d4d4d8",
  gray400: "#a1a1aa",
  gray500: "#71717a",
  gray600: "#52525b",
  gray700: "#3f3f46",
  gray800: "#27272a",
  gray900: "#18181b",

  warning: "#FFFBEA",
  warning50: "#FFFBEA",
  warning100: "#FFF3C4",
  warning200: "#FCE588",
  warning300: "#FADB5F",
  warning400: "#F7C948",
  warning500: "#F0B429",
  warning600: "#DE911D",
  warning700: "#CB6E17",
  warning800: "#B44D12",
  warning900: "#8D2B0B",

  error: "#EF4E4E",
  error50: "#FFE3E3",
  error100: "#FFBDBD",
  error200: "#FF9B9B",
  error300: "#F86A6A",
  error400: "#EF4E4E",
  error500: "#E12D39",
  error600: "#CF1124",
  error700: "#AB091E",
  error800: "#8A041A",
  error900: "#610316",

  success: "#EFFCF6",
  success50: "#EFFCF6",
  success100: "#C6F7E2",
  success200: "#8EEDC7",
  success300: "#65D6AD",
  success400: "#3EBD93",
  success500: "#27AB83",
  success600: "#199473",
  success700: "#147D64",
  success800: "#0C6B58",
  success900: "#014D40",

  accent: "#E0FCFF",
  accent50: "#E0FCFF",
  accent100: "#BEF8FD",
  accent200: "#87EAF2",
  accent300: "#54D1DB",
  accent400: "#38BEC9",
  accent500: "#2CB1BC",
  accent600: "#14919B",
  accent700: "#0E7C86",
  accent800: "#0A6C74",
  accent900: "#044E54",
};

const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

const spacing: RecursivePartial<ThemeSpacing> = {
  "0": 0,
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "7": 28,
  "8": 32,
  "9": 36,
  "10": 40,
  "11": 44,
  "12": 48,
  "14": 56,
  "16": 64,
  "20": 80,
  "24": 96,
  "28": 112,
  "32": 128,
  "36": 144,
  "40": 160,
  "44": 176,
  "48": 192,
  "52": 208,
  "56": 224,
  "60": 240,
  "64": 256,
  "72": 288,
  "80": 320,
  "96": 384,
};

export const defaultTheme = {
  themeName,
  colors,
  borderRadius,
  spacing,
};
