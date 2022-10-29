import { PortalProvider } from "@gorhom/portal";
import { ThemeProvider } from "@rneui/themed";
import "config/firebase";
import { theme } from "config/rne";
import RootNavigation from "navigation/index";
import React from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Debugger from "src/component/Debugger";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <RootSiblingParent>
          <PortalProvider>
            <RootNavigation />
          </PortalProvider>
        </RootSiblingParent>
        <Debugger />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
