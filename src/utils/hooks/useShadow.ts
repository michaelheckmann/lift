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
    shadowColor: theme.colors.primary900,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  };
  return shadow;
}
