import React from "react";

import { PortalProvider } from "@gorhom/portal";
import { ThemeProvider } from "@rneui/themed";
import { render, RenderOptions } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "src/config/rne";

const Onion = ({ children }) => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <PortalProvider>{children}</PortalProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

// The renderOnion function is used to wrap the component under test with the Onion component.
export function renderOnion(
  ui: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
  options: RenderOptions = {}
) {
  return render(ui, { wrapper: Onion, ...options });
}
