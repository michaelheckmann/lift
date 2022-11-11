import { useTheme } from "@rneui/themed";
import { useEffect } from "react";
import { useBlockStore } from "src/store";
import { defaultTheme } from "../themes/default";
import { darkTheme } from "./../themes/dark";

const themes = {
  light: defaultTheme,
  dark: darkTheme,
};

export function useCustomTheme() {
  const { updateTheme } = useTheme();
  useEffect(() => {
    const unsub = useBlockStore.subscribe(
      (state) => state.settings.theme,
      (theme) => {
        // console.log("THEME", theme);
        return updateTheme(themes[theme]);
      }
    );
    return unsub;
  }, []);
}
