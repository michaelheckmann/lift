import { Colors } from "@rneui/themed";
import { RecursivePartial } from "@rneui/themed/dist/config/theme";
import { Themes } from "../types/Settings";
import { defaultTheme } from "./default";

const themeName: Themes = "halloween";

const colors: RecursivePartial<Colors> = {
  ...defaultTheme.colors,

  primary: "#fc7313",
  primary50: "#fff7ed",
  primary100: "#ffedd4",
  primary200: "#ffd8a9",
  primary300: "#ffb86c",
  primary400: "#fe9339",
  primary500: "#fc7313",
  primary600: "#ed5809",
  primary700: "#c54109",
  primary800: "#9c3410",
  primary900: "#7e2d10",

  background: "#282a36",
  foreground: "#3a3e52",
  border: "#868daa",
  text: "#f6f7f9",

  gray50: "#f6f7f9",
  gray100: "#ecedf2",
  gray200: "#d5d7e2",
  gray300: "#b1b6c8",
  gray400: "#868daa",
  gray500: "#676f90",
  gray600: "#525877",
  gray700: "#434761",
  gray800: "#3a3e52",
  gray900: "#282a36",

  error: "#ff5555",
  error50: "#fff1f1",
  error100: "#ffe1e1",
  error200: "#ffc7c7",
  error300: "#ffa0a0",
  error400: "#ff5555",
  error500: "#f83b3b",
  error600: "#e51d1d",
  error700: "#c11414",
  error800: "#a01414",
  error900: "#841818",

  accent: "#ff79c6",
  accent50: "#fef1f9",
  accent100: "#fee5f4",
  accent200: "#ffcbec",
  accent300: "#ffa1da",
  accent400: "#ff79c6",
  accent500: "#fa3aa3",
  accent600: "#ea1880",
  accent700: "#cc0a65",
  accent800: "#a80c53",
  accent900: "#8c0f47",
};

export const halloweenTheme = {
  ...defaultTheme,
  themeName,
  colors,
};
