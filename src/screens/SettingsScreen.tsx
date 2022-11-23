import { Button, makeStyles, Switch } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { auth } from "src/config/firebase";
import { useBlockStore } from "src/store";
import { updateSettings } from "src/store/actions/settingsActions";
import { useAuth } from "src/utils/hooks/useAuth";
import { SettingSlice } from "src/utils/types/Settings";

const selector = (state) => state.settings;

export default function SettingsScreen() {
  const styles = useStyles();
  const { user } = useAuth();
  const settings: SettingSlice = useBlockStore(selector);
  const { id: settingsId, theme } = settings;

  const logout = () => {
    signOut(auth);
  };

  if (!user) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text>Settings screen! {theme}</Text>
      <Switch
        testID="theme-switch"
        value={theme === "dark"}
        onValueChange={() =>
          updateSettings.dispatch({
            id: settingsId,
            theme: theme === "dark" ? "light" : "dark",
          })
        }
        style={{ marginBottom: 100, marginTop: 100 }}
      />
      <Button title="Logout" onPress={logout} />
      <StatusBar style="auto" />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    // backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: theme.spacing.md,
  },
}));
