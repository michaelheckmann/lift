import { Button, makeStyles } from "@rneui/themed";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import { createSetGroup } from "src/store/actions/setgroupActions";
import { updateWorkout } from "src/store/actions/workoutsActions";
import { ExerciseSlice } from "src/utils/types/Exercise";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import ExercisePicker from "../ExercisePicker/ExercisePicker";
import SetGroup from "../SetGroup/SetGroup";
import WorkoutHeader from "./WorkoutHeader";

type Props = {
  onClose: () => void;
  workoutData: Partial<WorkoutJoin>;
  isCollapsed: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Workout({
  onClose,
  workoutData,
  isCollapsed,
  setExpanded,
}: Props) {
  const styles = useStyles();
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

  const openExercisePicker = () => {
    setExercisePickerVisible(true);
  };

  const closeExercisePicker = () => {
    setExercisePickerVisible(false);
  };

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
      <WorkoutHeader
        isCollapsed={isCollapsed}
        handleFinish={handleFinish}
        setExpanded={setExpanded}
      />

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
            title="Add Exercise"
            buttonStyle={styles.addSetGroupButton}
            titleStyle={styles.addSetGroupButtonText}
            onPress={openExercisePicker}
          />
          <Button
            title="Finish Workout"
            buttonStyle={styles.finishWorkoutButton}
            titleStyle={styles.finishWorkoutButtonText}
            onPress={handleSubmit(onSubmit)}
          />
        </KeyboardAwareScrollView>
      )}

      {/* Exercise Picker Dialog */}
      <Modal
        isVisible={exercisePickerVisible}
        onBackdropPress={closeExercisePicker}
        backdropOpacity={0.7}
        animationInTiming={300}
        animationIn="zoomIn"
        animationOut="slideOutDown"
        animationOutTiming={300}
      >
        <ExercisePicker
          closeDialog={closeExercisePicker}
          onExerciseSelected={handleAppendSetGroup}
        />
      </Modal>
    </View>
  );
}

const useStyles = makeStyles((theme) => {
  const { colors, spacing, mode } = theme;
  return {
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
    form: {
      width: "100%",
    },
    addSetGroupButton: {
      backgroundColor: colors.background,
      borderColor: colors.text,
      marginBottom: spacing["4"],
    },
    addSetGroupButtonText: {
      color: colors.text,
    },
    finishWorkoutButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      marginBottom: spacing["4"],
    },
    finishWorkoutButtonText: {
      color: mode === "dark" ? colors.primary900 : colors.primary50,
    },
  };
});
