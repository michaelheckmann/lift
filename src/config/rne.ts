import { createTheme } from "@rneui/themed";
import { defaultTheme } from "../utils/themes/default";

const { colors, borderRadius, spacing } = defaultTheme;

export const theme = createTheme({
  lightColors: colors,
  spacing,
  borderRadius,
  components: {
    Button: {
      buttonStyle: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing["3"],
        paddingHorizontal: spacing["5"],
        width: "100%",
        borderColor: colors.gray900,
        borderWidth: spacing["0.5"],
      },
      titleStyle: {
        color: colors.gray900,
        fontWeight: "bold",
        letterSpacing: 1.2,
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
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        backgroundColor: "transparent",
        borderColor: colors.gray100,
        borderWidth: spacing["1.5"],
        borderBottomWidth: spacing["1"],
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
