import { Colors } from "@rneui/themed";
import { RecursivePartial } from "@rneui/themed/dist/config/theme";
import { defaultTheme } from "./default";

const colors: RecursivePartial<Colors> = {
  primary50: "#FFE3EC",
  primary100: "#FFB8D2",
  primary200: "#FF8CBA",
  primary300: "#F364A2",
  primary400: "#E8368F",
  primary500: "#DA127D",
  primary600: "#BC0A6F",
  primary700: "#A30664",
  primary800: "#870557",
  primary900: "#620042",
};

export const darkTheme = {
  ...defaultTheme,
  colors,
};
