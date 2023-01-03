import { CreateThemeOptions, useTheme, useThemeMode } from "@rneui/themed";
import { useEffect } from "react";
import { useLiftStore } from "src/store";
import { defaultTheme } from "../themes/default";
import { halloweenTheme } from "../themes/halloween";
import { darkTheme } from "./../themes/dark";
import { Themes } from "./../types/Settings";

type ThemeDict = {
  [theme in Themes]: {
    mode: "light" | "dark";
    theme: CreateThemeOptions;
  };
};

const themes: ThemeDict = {
  light: {
    mode: "light",
    theme: defaultTheme,
  },
  dark: {
    mode: "dark",
    theme: darkTheme,
  },
  halloween: {
    mode: "dark",
    theme: halloweenTheme,
  },
};

export function useCustomTheme() {
  const { updateTheme } = useTheme();
  const { setMode } = useThemeMode();

  useEffect(() => {
    console.log("Init useCustomTheme");
    const unsub = useLiftStore.subscribe(
      (state) => state.settings.theme,
      (theme) => {
        console.log("THEME", theme);
        setMode(themes[theme].mode);
        return updateTheme(themes[theme].theme);
      }
    );
    return unsub;
  }, []);

  // This is used to force a re-render
  // on the first render
  useLiftStore.setState(useLiftStore.getState());
}
