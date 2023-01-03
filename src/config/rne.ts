import { createTheme } from "@rneui/themed";
import { defaultTheme } from "../utils/themes/default";

const { colors, borderRadius, spacing } = defaultTheme;

export const theme = createTheme({
  lightColors: colors,
  darkColors: colors,
  spacing,
  borderRadius,
  components: {
    Button: {
      buttonStyle: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing["3"],
        paddingHorizontal: spacing["5"],
        width: "100%",
        borderColor: colors.border,
        borderWidth: spacing["0.5"],
      },
      titleStyle: {
        color: colors.primary900,
        fontWeight: "bold",
      },
      loadingProps: {
        color: colors.black,
      },
      disabledStyle: {
        opacity: 0.5,
      },
    },
    Input: {
      containerStyle: {
        paddingHorizontal: 0,
      },
      inputContainerStyle: {
        borderRadius: borderRadius.sm,
        paddingVertical: spacing["1"],
        paddingHorizontal: spacing["3"],
        backgroundColor: "transparent",
        borderColor: colors.border,
        borderWidth: spacing["0.5"],
        borderBottomWidth: spacing["0.5"],
        minWidth: 0,
      },
      placeholderTextColor: colors.text,
      inputStyle: {
        color: colors.text,
      },
      leftIconContainerStyle: {
        marginRight: spacing["1"],
      },
    },
  },
});
