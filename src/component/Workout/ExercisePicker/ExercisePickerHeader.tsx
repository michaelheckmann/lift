import Icon from "@expo/vector-icons/Ionicons";
import { Button, Input, makeStyles, useTheme } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

export default function ExercisePickerHeader({
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  exerciseMode,
  exercisesSelected,
  searchInput,
  setSearchInput,
}) {
  const styles = useStyles();
  const { theme } = useTheme();
  return (
    <View style={styles.headingContainer}>
      <View style={styles.buttonRow}>
        <Button
          title={
            exercisesSelected
              ? "Clear"
              : exerciseMode === "add"
              ? "Add Exercise"
              : "New Exercise"
          }
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.secondaryButton}
          titleStyle={styles.secondaryButtonText}
          onPress={onSecondaryButtonPress}
        />
        <View style={{ width: theme.spacing["5"] }} />
        <Button
          title={exercisesSelected ? "Add Exercise" : "Cancel"}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.primaryButton}
          titleStyle={styles.primaryButtonText}
          onPress={onPrimaryButtonPress}
        />
      </View>
      {exerciseMode === "list" && (
        <Input
          returnKeyType="search"
          onSubmitEditing={() => {}}
          placeholder="Search for an exercise"
          value={searchInput}
          keyboardType="default"
          autoCapitalize="words"
          autoCorrect={false}
          renderErrorMessage={false}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          onChangeText={setSearchInput}
          placeholderTextColor={theme.colors.gray500}
          leftIcon={
            <Icon
              name="search"
              color={theme.colors.gray500}
              size={theme.spacing["5"]}
            />
          }
        />
      )}
    </View>
  );
}
const useStyles = makeStyles((theme) => {
  const { colors, spacing, mode } = theme;
  return {
    headingContainer: {
      marginBottom: spacing["4"],
      justifyContent: "center",
      alignItems: "center",
      padding: spacing["4"],
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing["4"],
    },
    buttonContainer: {
      flex: 1,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    primaryButtonText: {
      fontSize: spacing["3.5"],
      color: mode === "dark" ? colors.primary900 : colors.primary50,
      letterSpacing: 0,
    },
    secondaryButton: {
      backgroundColor: "transparent",
    },
    secondaryButtonText: {
      fontSize: spacing["3.5"],
      color: colors.text,
      letterSpacing: 0,
    },
    searchInputContainer: {
      paddingVertical: spacing["0"],
      paddingHorizontal: spacing["3"],
      backgroundColor: colors.background,
    },
    searchInput: {
      fontSize: spacing["3.5"],
      color: colors.text,
    },
  };
});
