import { createTheme } from "@rneui/themed";
import { defaultTheme } from "../utils/themes/default";

const { colors, border, spacing } = defaultTheme;

// defaultSpacing = {
//   xs: 2,
//   sm: 4,
//   md: 8,
//   lg: 12,
//   xl: 24
// };

export const theme = createTheme({
  lightColors: colors,
  spacing,
  border,
  components: {
    Button: {
      buttonStyle: {
        backgroundColor: colors.grey2,
        borderRadius: border.radius.md,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.axl,
        width: "100%",
        // borderColor: colors.grey7,
        // borderWidth: 2,
      },
      titleStyle: {
        color: colors.grey7,
        fontWeight: "500",
        letterSpacing: 1.05,
      },
      loadingProps: {
        color: colors.black,
      },
      disabledStyle: {
        opacity: 0.5,
      },
    },
    Input: {
      inputContainerStyle: {
        borderRadius: border.radius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        backgroundColor: "transparent",
        borderColor: colors.grey7,
        borderWidth: border.width.lg,
        borderBottomWidth: border.width.lg,
        // width: "100%",
        minWidth: 300,
      },
      inputStyle: {
        color: colors.black,
      },
      leftIconContainerStyle: {
        marginRight: spacing.md,
      },
    },
  },
});
