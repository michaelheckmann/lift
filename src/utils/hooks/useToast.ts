import Toast, { ToastOptions } from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "src/config/rne";

type ToastTypes = "info" | "success" | "error" | "warning";

export function useToast() {
  const insets = useSafeAreaInsets();

  const infoColors = {
    backgroundColor: theme.lightColors.primary,
    textColor: theme.lightColors.white,
    shadowColor: "#2563eb",
  };
  const errorColors = {
    backgroundColor: theme.lightColors.error,
    textColor: theme.lightColors.white,
    shadowColor: "#b91c1c",
  };
  const successColors = {
    backgroundColor: theme.lightColors.success,
    textColor: theme.lightColors.white,
    shadowColor: "#059669",
  };
  const warningColors = {
    backgroundColor: theme.lightColors.warning,
    textColor: theme.lightColors.white,
    shadowColor: "#d97706",
  };

  const colors = {
    info: infoColors,
    success: successColors,
    error: errorColors,
    warning: warningColors,
  };

  const showToast = (
    text: string,
    type: ToastTypes = "info",
    options: ToastOptions = {}
  ) => {
    Toast.show(text, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP + insets.top,
      opacity: 1,
      shadow: false,
      containerStyle: {
        backgroundColor: colors[type].backgroundColor,
        paddingHorizontal: 25,
        paddingVertical: 15,
        opacity: 1,
        shadowColor: colors[type].shadowColor,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
      },
      textStyle: {
        color: colors[type].textColor,
        fontWeight: "600",
      },
      ...options,
    });
  };

  return showToast;
}
