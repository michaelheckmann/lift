import { Button, makeStyles, Switch } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { getAuth, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { collections } from "src/utils/functions/firestore";
import { useAuth } from "src/utils/hooks/useAuth";

const auth = getAuth();

export default function SettingsScreen() {
  const styles = useStyles();
  const { user, profile } = useAuth();

  const setTheme = (e: boolean) => {
    const ref = doc(collections.profiles, user.uid);
    updateDoc(ref, {
      "settings.theme": e ? "dark" : "light",
    });
  };

  const logout = () => {
    signOut(auth);
  };

  if (!user || !profile) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text>Settings screen! {profile.settings.theme}</Text>
      <Switch
        value={profile.settings.theme === "dark"}
        onValueChange={setTheme}
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
