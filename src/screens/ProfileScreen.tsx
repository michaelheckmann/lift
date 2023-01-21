import { makeStyles, useThemeMode } from "@rneui/themed";
import React from "react";
import { Text, View } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionGroup from "src/component/Profile/OptionGroup";
import { getProfileOptionGroups } from "src/utils/functions/getProfileOptionGroups";

export default function ProfileScreen() {
  const styles = useStyles();
  const { mode } = useThemeMode();
  const optionGroups = getProfileOptionGroups();

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
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing["4"],
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  heading: {
    fontSize: spacing["8"],
    letterSpacing: spacing["0.5"],
    marginTop: spacing["3"],
    marginBottom: spacing["8"],
    fontWeight: "bold",
    color: colors.text,
  },
  optionGroupContainer: {
    width: "100%",
  },
  optionGroupSeparator: {
    height: spacing["8"],
  },
}));
