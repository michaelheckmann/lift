import { useTheme } from "@rneui/themed";
import { Profile } from "src/utils/types/Profile";
import { defaultTheme } from "../themes/default";
import { darkTheme } from "./../themes/dark";

const themes = {
  light: defaultTheme,
  dark: darkTheme,
};

export function useCustomTheme() {
  const { updateTheme } = useTheme();

  const setCustomTheme = (profile: Profile) => {
    const { theme } = profile.settings;
    updateTheme(themes[theme]);
  };

  return setCustomTheme;
}
