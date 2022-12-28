import { makeStyles } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "src/utils/hooks/useAuth";

export default function SearchScreen() {
  const styles = useStyles();
  const { user } = useAuth();

  if (!user) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Search screen</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
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
