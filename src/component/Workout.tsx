import { Button, Dialog, makeStyles } from "@rneui/themed";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Dimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createSetGroup } from "src/store/actions/setgroupActions";
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
    setExercisePickerVisible(true);
    // Reactivate after testing
    // updateWorkout.dispatch({
    //   id: workoutData.id,
    //   done: true,
    // });
    // onClose();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Button
          buttonStyle={styles.headerButton}
          titleStyle={styles.headerButtonText}
          title="Workout"
          onPress={handleFinish}
        />
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

const useStyles = makeStyles((theme, { isCollapsed }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: isCollapsed ? 0 : theme.spacing.cxl,
    backgroundColor: theme.colors.grey0,
  },
  headerButton: {
    alignItems: "center",
    width: "auto",
  },
  headerButtonText: {
    fontWeight: "800",
  },
  form: {
    width: "100%",
  },
  exercisePickerOverlay: {
    // backgroundColor: "blue",
    width: WINDOW_WIDTH * 0.9,
    borderRadius: theme.border.radius.md,
  },
}));
