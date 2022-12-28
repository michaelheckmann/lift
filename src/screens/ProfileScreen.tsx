import { makeStyles } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionGroup from "src/component/Profile/OptionGroup";
import { getOptionGroups } from "src/utils/functions/getOptionGroups";

export default function ProfileScreen() {
  const styles = useStyles();
  const optionGroups = getOptionGroups();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <View style={styles.optionGroupContainer}>
        <KeyboardAwareFlatList
          data={optionGroups}
          scrollEnabled={false}
          renderItem={(props) => <OptionGroup {...props} />}
          keyExtractor={(item) => item[0].label}
          ItemSeparatorComponent={() => (
            <View style={styles.optionGroupSeparator} />
          )}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing["6"],
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  heading: {
    fontSize: spacing["9"],
    letterSpacing: spacing["0.5"],
    marginTop: spacing["3"],
    marginBottom: spacing["8"],
    fontWeight: "bold",
  },
  optionGroupContainer: {
    width: "100%",
  },
  optionGroupSeparator: {
    height: spacing["8"],
  },
}));
