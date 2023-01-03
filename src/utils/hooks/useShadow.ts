import { useTheme } from "@rneui/themed";

/**
 * It returns a shadow object based on the level you pass in
 * @param {LEVEL} [level=1] - The level of the shadow.
 * @returns A shadow object
 */
type LEVEL = 1 | 2 | 3 | 4 | 5 | 6;
export function useShadow(level: LEVEL = 1) {
  const { theme } = useTheme();
  const shadow = {
    shadowColor: theme.colors.gray900,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  };
  if (level === 2) {
    shadow.shadowOffset = {
      width: 0,
      height: 8,
    };
    shadow.shadowOpacity = 0.3;
    shadow.shadowRadius = 2;
    shadow.elevation = 4;
  } else if (level === 3) {
    shadow.shadowOffset = {
      width: 0,
      height: 12,
    };
    shadow.shadowOpacity = 0.35;
    shadow.shadowRadius = 3;
    shadow.elevation = 6;
  } else if (level === 4) {
    shadow.shadowOffset = {
      width: 0,
      height: 16,
    };
    shadow.shadowOpacity = 0.4;
    shadow.shadowRadius = 4;
    shadow.elevation = 8;
  } else if (level === 5) {
    shadow.shadowOffset = {
      width: 0,
      height: 20,
    };
    shadow.shadowOpacity = 0.45;
    shadow.shadowRadius = 5;
    shadow.elevation = 10;
  } else if (level === 6) {
    shadow.shadowOffset = {
      width: 0,
      height: 24,
    };
    shadow.shadowOpacity = 0.5;
    shadow.shadowRadius = 6;
    shadow.elevation = 12;
  }
  return shadow;
}
