import Icon from "@expo/vector-icons/Ionicons";
import { Input, makeStyles, useTheme } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { useLiftStore } from "src/store";
import { createExercise } from "src/store/actions/exerciseActions";
import { getThemeConfig } from "src/utils/functions/getThemeConfig";
import { prepareExerciseList } from "src/utils/functions/prepareExerciseList";
import { useShadow } from "src/utils/hooks/useShadow";
import { ExerciseSlice } from "src/utils/types/Exercise";
import ExerciseList from "./ExerciseList";
import ExercisePickerHeader from "./ExercisePickerHeader";

const WINDOW_HEIGHT = Dimensions.get("window").height;

const selector = (state) => state.exercises;

export default function ExercisePicker({ closeDialog, onExerciseSelected }) {
  const shadow = useShadow(3);
  const styles = useStyles({ shadow });
  const { theme } = useTheme();

  const [newExerciseName, setNewExerciseName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [exerciseList, setExerciseList] = useState<ExerciseSlice[]>([]);
  const [stickyHeaderIndizes, setStickyHeaderIndizes] = useState<number[]>([]);
  const [exerciseMode, setExerciseMode] = useState<"list" | "add">("list");
  const [selectedExercises, setSelectedExercises] = useState<ExerciseSlice[]>(
    []
  );

  const exercises = useLiftStore(selector);

  /* Prepare the list of exercises */
  useEffect(() => {
    const { sortedList, stickyHeaders } = prepareExerciseList(
      exercises.slice(),
      searchInput
    );
    setExerciseList(sortedList);
    setStickyHeaderIndizes(stickyHeaders);
  }, [exercises, searchInput]);

  /* Select the newly created exercise */
  useEffect(() => {
    if (newExerciseName === "") return;
    const matchingExercise = exercises.find(
      (e: ExerciseSlice) => e.name === newExerciseName
    );
    if (matchingExercise) {
      setSelectedExercises((exercises) => [...exercises, matchingExercise]);
      setNewExerciseName("");
    }
  }, [exercises, newExerciseName]);

  const submitExercise = () => {
    // Only supporting one exercise for now
    onExerciseSelected(selectedExercises[0]);
    closeDialog();
  };

  const addNewExercise = () => {
    if (
      newExerciseName === "" ||
      exercises.find((e) => e.name === newExerciseName)
    ) {
      return;
    }
    createExercise.dispatch({ name: newExerciseName });
    setExerciseMode("list");
  };

  const clearSelectedExercises = () => {
    setSelectedExercises([]);
  };

  const onPrimaryButtonPress = () => {
    if (selectedExercises.length > 0) {
      submitExercise();
    } else if (exerciseMode === "add") {
      setExerciseMode("list");
      setNewExerciseName("");
    } else {
      closeDialog();
    }
  };

  const onSecondaryButtonPress = () => {
    if (selectedExercises.length > 0) {
      clearSelectedExercises();
    } else if (exerciseMode === "add") {
      addNewExercise();
    } else {
      setExerciseMode("add");
    }
  };

  return (
    <View style={styles.container}>
      <ExercisePickerHeader
        onPrimaryButtonPress={onPrimaryButtonPress}
        onSecondaryButtonPress={onSecondaryButtonPress}
        exerciseMode={exerciseMode}
        exercisesSelected={selectedExercises.length > 0}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {exerciseMode === "list" && (
        <ExerciseList
          exerciseList={exerciseList}
          stickyHeaderIndizes={stickyHeaderIndizes}
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
        />
      )}
      {exerciseMode === "add" && (
        <View style={styles.addExerciseContainer}>
          <Input
            returnKeyType="done"
            onSubmitEditing={addNewExercise}
            placeholder="Enter a name for your new exercise"
            value={newExerciseName}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            renderErrorMessage={false}
            inputContainerStyle={styles.searchInputContainer}
            inputStyle={styles.searchInput}
            returnKeyLabel="Create"
            onChangeText={setNewExerciseName}
            leftIcon={
              <Icon
                name="add"
                color={theme.colors.text}
                size={theme.spacing["5"]}
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((theme, { shadow }) => {
  const { colors, spacing, borderRadius } = theme;
  return {
    container: {
      height: WINDOW_HEIGHT * 0.8,
      backgroundColor: getThemeConfig(
        "ExercisePicker.container.backgroundColor",
        theme
      ),
      borderRadius: borderRadius.md,
      overflow: "hidden",
      ...shadow,
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
    addExerciseContainer: {
      padding: spacing["4"],
      marginTop: spacing["48"],
      borderColor: "red",
    },
  };
});
