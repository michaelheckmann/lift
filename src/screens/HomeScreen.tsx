import { Button, makeStyles } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import WorkoutSheet from "src/component/WorkoutSheet";
import { createWorkout } from "src/store/actions/workoutsActions";
import { getWorkoutbyId } from "src/utils/functions/dataFetching";
import { useActiveWorkout } from "src/utils/hooks/useActiveWorkout";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

export default function HomeScreen() {
  const styles = useStyles();
  const [isWorkoutSheetOpen, setIsWorkoutSheetOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState<Partial<WorkoutJoin>>({});
  const activeWorkoutId = useActiveWorkout();

  const setExistingWorkout = () => {
    const activeWorkout = getWorkoutbyId(activeWorkoutId);
    console.log(activeWorkout);
    setWorkoutData(activeWorkout);
    setIsWorkoutSheetOpen(true);
  };

  const createBlankWorkout = () => {
    const id = createWorkout.dispatch();
    console.log("CREATE WORKOUT ID", id);
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
      <Text>Active Workout: {activeWorkoutId}</Text>
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

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBottom: theme.spacing.xxl,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: theme.spacing.cxl,
  },
}));
