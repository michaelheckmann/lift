import { Colors, Theme } from "@rneui/themed";
import dot from "dot-object";
import { TextStyle, ViewStyle } from "react-native";
import { Filter, Join, PathsToStringProps } from "../types/lib/DotNotation";
import { Themes } from "../types/Settings";

type DottedObjectPaths = PathsToStringProps<ReturnType<typeof getConfigMap>>;
type TrimmedDottedObjectPaths = Filter<DottedObjectPaths, Themes>;
type DottedObjectPathsString = Join<TrimmedDottedObjectPaths, ".">;

type ThemeType = {
  colors: Colors;
} & Theme;

type Styles = keyof ViewStyle | keyof TextStyle;

type ConfigMap = {
  [key: string]: {
    [key: string]: {
      [key in Styles]?: {
        [key in Themes]: any;
      };
    };
  };
};

const getConfigMap = (theme: ThemeType): ConfigMap => {
  const { colors } = theme;
  return {
    Workout: {},
    SetGroup: {
      addSetButton: {
        backgroundColor: {
          light: colors.gray200,
          dark: colors.gray700,
          halloween: colors.gray700,
        },
      },
    },
    Set: {
      setInput: {
        backgroundColor: {
          light: colors.gray200,
          dark: colors.gray700,
          halloween: colors.gray700,
        },
      },
    },
    ExercisePicker: {
      container: {
        backgroundColor: {
          light: colors.foreground,
          dark: colors.background,
          halloween: colors.background,
        },
      },
      stickyItem: {
        backgroundColor: {
          light: colors.gray200,
          dark: colors.gray800,
          halloween: colors.gray800,
        },
        borderColor: {
          light: colors.gray300,
          dark: colors.gray500,
          halloween: colors.gray400,
        },
        color: {
          light: colors.gray700,
          dark: colors.gray400,
          halloween: colors.gray400,
        },
      },
      renderItem: {
        backgroundColor: {
          light: colors.background,
          dark: colors.background,
          halloween: colors.background,
        },
      },
      renderItemSelected: {
        backgroundColor: {
          light: colors.accent50,
          dark: colors.accent900,
          halloween: colors.accent,
        },
      },
    },
  };
};

export function getThemeConfig(key: DottedObjectPathsString, theme: ThemeType) {
  const defaultValue = "light";
  const config = dot.dot(getConfigMap(theme));
  return (
    config[`${key}.${theme.themeName}`] || config[`${key}.${defaultValue}`]
  );
}
