import { makeStyles } from "@rneui/themed";
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
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background50,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: theme.spacing.md,
  },
}));
