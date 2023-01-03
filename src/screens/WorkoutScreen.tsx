import { Button, makeStyles } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import WorkoutSheet from "src/component/Workout/WorkoutSheet";
import { setWorkoutSheetCollapsed } from "src/store/actions/operationsActions";
import { createWorkout } from "src/store/actions/workoutsActions";
import { getWorkoutbyId } from "src/utils/functions/dataFetching";
import { useActiveWorkout } from "src/utils/hooks/useActiveWorkout";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

export default function WorkoutScreen() {
  const styles = useStyles();
  const [isWorkoutSheetOpen, setIsWorkoutSheetOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState<Partial<WorkoutJoin>>({});
  const activeWorkoutId = useActiveWorkout();

  /**
   * It gets the workout by id, sets the workout data to the active workout,
   * and then opens the workout sheet
   */
  const setExistingWorkout = () => {
    const activeWorkout = getWorkoutbyId(activeWorkoutId);
    setWorkoutData(activeWorkout);
    setIsWorkoutSheetOpen(true);
  };

  /**
   * When the user clicks the "Blank Workout" button, we dispatch an action to create a new workout,
   * and then we open the workout sheet
   */
  const createBlankWorkout = () => {
    const id = createWorkout.dispatch();
    // console.log("CREATE WORKOUT ID", id);
    setWorkoutData({ id });
    setIsWorkoutSheetOpen(true);
  };

  const closeWorkoutSheet = () => {
    setIsWorkoutSheetOpen(false);
    // This is needed to control the tab navgiator style
    setWorkoutSheetCollapsed(undefined);
  };

  useEffect(() => {
    if (activeWorkoutId && !isWorkoutSheetOpen) {
      setExistingWorkout();
    }
  }, [activeWorkoutId]);

  return (
    <View style={styles.container}>
      {/* Spacer Placeholder */}
      <View style={styles.spacer} />

      <Button
        title="Blank workout"
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        containerStyle={styles.buttonContainer}
        onPress={createBlankWorkout}
        disabled={isWorkoutSheetOpen || !!activeWorkoutId}
      />

      <WorkoutSheet
        isOpen={isWorkoutSheetOpen}
        onClose={closeWorkoutSheet}
        workoutData={workoutData}
      />
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors, mode }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["6"],
  },
  button: {
    borderWidth: 0,
    backgroundColor: colors.primary,
  },
  buttonTitle: {
    color: mode === "dark" ? colors.primary900 : colors.primary50,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: spacing["10"],
  },
  spacer: {
    flex: 1,
  },
}));
