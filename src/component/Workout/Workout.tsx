import { Button, Dialog, makeStyles } from "@rneui/themed";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createSetGroup } from "src/store/actions/setgroupActions";
import { updateWorkout } from "src/store/actions/workoutsActions";
import { ExerciseSlice } from "src/utils/types/Exercise";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import ExercisePicker from "./ExercisePicker";
import SetGroup from "./SetGroup";

const WINDOW_WIDTH = Dimensions.get("window").width;

type Props = {
  onClose: () => void;
  workoutData: Partial<WorkoutJoin>;
  isCollapsed: boolean;
};

export default function Workout({ onClose, workoutData, isCollapsed }: Props) {
  const styles = useStyles({ isCollapsed });
  const [exercisePickerVisible, setExercisePickerVisible] = useState(false);

  /* Definition of the form values and methods */
  const methods = useForm<WorkoutJoin>({
    defaultValues: useMemo(() => workoutData, [workoutData]),
  });
  const { control, handleSubmit, reset } = methods;
  const { fields, append } = useFieldArray({
    control,
    name: "setGroups",
    keyName: "fieldId",
  });

  const onSubmit = (data) => console.log(JSON.stringify(data, null, 4));

  const handleAppendSetGroup = (exercise: ExerciseSlice) => {
    const defaultSetGroup = {
      order: fields.length + 1,
      exercise_id: exercise.id,
      exercise,
      sets: [],
      archived: false,
      workout_id: workoutData.id,
    };

    const id = createSetGroup.dispatch({
      workout_id: defaultSetGroup.workout_id,
      order: defaultSetGroup.order,
      exercise_id: defaultSetGroup.exercise_id,
    });

    append({ ...defaultSetGroup, id });
  };

  useEffect(() => {
    reset(workoutData);
  }, [workoutData]);

  const handleFinish = () => {
    updateWorkout.dispatch({
      id: workoutData.id,
      done: true,
    });
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {!isCollapsed && (
          <View style={styles.dragAffordanceContainer}>
            <View style={styles.dragAffordance} />
          </View>
        )}
        <TouchableOpacity onPress={handleFinish}>
          <Text style={styles.heading}>Workout</Text>
        </TouchableOpacity>
      </View>

      {!isCollapsed && (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.form}
        >
          {fields.map((setGroup, setGroupIndex) => {
            return (
              <SetGroup
                key={setGroup.fieldId}
                setGroup={setGroup}
                setGroupIndex={setGroupIndex}
                methods={methods}
              />
            );
          })}

          <Button
            style={{ marginBottom: 20 }}
            title="append setgroup"
            onPress={() => setExercisePickerVisible(true)}
          />
          <Button
            style={{ marginBottom: 20 }}
            title="submit"
            onPress={handleSubmit(onSubmit)}
          />
        </KeyboardAwareScrollView>
      )}

      {/* Exercise Picker Dialog */}
      <Dialog
        animationType="fade"
        isVisible={exercisePickerVisible}
        onBackdropPress={() => setExercisePickerVisible(false)}
        overlayStyle={styles.exercisePickerOverlay}
      >
        <ExercisePicker
          closeDialog={() => setExercisePickerVisible(false)}
          onExerciseSelected={handleAppendSetGroup}
        />
      </Dialog>
    </View>
  );
}

const useStyles = makeStyles(
  ({ colors, spacing, borderRadius }, { isCollapsed }) => ({
    container: {
      flex: 1,
      // backgroundColor: "blue",
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
    headerContainer: {
      width: "100%",
      marginBottom: isCollapsed ? 0 : spacing[2],
    },
    heading: {
      fontSize: spacing["7"],
      fontWeight: "bold",
      marginTop: isCollapsed ? 0 : spacing[4],
      marginBottom: isCollapsed ? 0 : spacing[4],
    },
    dragAffordanceContainer: {
      width: "100%",
    },
    dragAffordance: {
      height: spacing["1.5"],
      width: spacing["12"],
      backgroundColor: colors.gray300,
      borderRadius: 5,
      marginTop: spacing["0.5"],
      marginBottom: spacing["0.5"],
      alignSelf: "center",
    },
    form: {
      width: "100%",
    },
    exercisePickerOverlay: {
      // backgroundColor: "blue",
      width: WINDOW_WIDTH * 0.9,
      borderRadius: borderRadius.sm,
    },
  })
);
