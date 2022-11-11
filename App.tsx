import { PortalProvider } from "@gorhom/portal";
import { ThemeProvider } from "@rneui/themed";
import "config/firebase";
import { theme } from "config/rne";
import RootNavigation from "navigation/index";
import React from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Debugger from "src/component/Debugger";
import { useDBSync } from "src/utils/hooks/useDBSync";

export default function App() {
  useDBSync();
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
