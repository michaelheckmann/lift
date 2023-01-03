import { Colors } from "@rneui/themed";
import { RecursivePartial } from "@rneui/themed/dist/config/theme";
import { Themes } from "../types/Settings";
import { defaultTheme } from "./default";

const themeName: Themes = "dark";

const colors: RecursivePartial<Colors> = {
  ...defaultTheme.colors,

  primary: "#f4f5f7",
  primary50: "#f4f5f7",
  primary100: "#e3e6ea",
  primary200: "#c9cdd8",
  primary300: "#a4abbc",
  primary400: "#778099",
  primary500: "#5c657e",
  primary600: "#4f566b",
  primary700: "#44485a",
  primary800: "#3d404d",
  primary900: "#1e1f25",

  gray50: "#f4f5f7",
  gray100: "#e3e6ea",
  gray200: "#c9cdd8",
  gray300: "#a4abbc",
  gray400: "#7b8293",
  gray500: "#454754",
  gray600: "#32343d",
  gray700: "#282a31",
  gray800: "#1e1f25",
  gray900: "#141518",

  background: "#141518",
  foreground: "#1e1f25",
  border: "#32343d",
  text: "#f4f5f7",
};

export const darkTheme = {
  ...defaultTheme,
  themeName,
  colors,
};
