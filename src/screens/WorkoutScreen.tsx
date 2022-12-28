import { Button, makeStyles } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import WorkoutSheet from "src/component/Workout/WorkoutSheet";
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
        containerStyle={styles.buttonContainer}
        onPress={createBlankWorkout}
        disabled={isWorkoutSheetOpen || !!activeWorkoutId}
      />

      <WorkoutSheet
        isOpen={isWorkoutSheetOpen}
        onClose={() => setIsWorkoutSheetOpen(false)}
        workoutData={workoutData}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["6"],
  },
  button: {
    marginBottom: spacing["15"],
  },
  buttonContainer: {
    width: "100%",
    marginBottom: spacing["10"],
  },
  spacer: {
    flex: 1,
  },
}));
