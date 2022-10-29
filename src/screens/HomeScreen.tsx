import { Button, makeStyles } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { View } from "react-native";
import WorkoutSheet from "src/component/WorkoutSheet";
import { collections } from "src/utils/functions/firestore";
import { useAuth } from "src/utils/hooks/useAuth";

export default function HomeScreen() {
  const styles = useStyles();
  const { user } = useAuth();
  const [isWorkoutSheetOpen, setIsWorkoutSheetOpen] = useState(false);
  const [workoutId, setWorkoutId] = useState("");

  const createBlankWorkout = () => {
    const ref = doc(collections.workouts);
    setDoc(ref, {
      user_id: user.uid,
      date: serverTimestamp(),
      done: false,
    });
    setWorkoutId(ref.id);
    setIsWorkoutSheetOpen(true);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Blank workout"
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        onPress={createBlankWorkout}
        disabled={isWorkoutSheetOpen}
      />

      <WorkoutSheet
        isOpen={isWorkoutSheetOpen}
        onClose={() => setIsWorkoutSheetOpen(false)}
        workoutData={{ id: workoutId }}
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
