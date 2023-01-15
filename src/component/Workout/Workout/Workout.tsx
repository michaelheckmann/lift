import { makeStyles } from "@rneui/themed";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";
import Modal from "react-native-modal";
import { createSetGroup } from "src/store/actions/setgroupActions";
import { ExerciseSlice } from "src/utils/types/Exercise";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import ExercisePicker from "../ExercisePicker/ExercisePicker";
import SetGroupList from "./SetGroupList";
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
  const { fields, append, move } = useFieldArray({
    control,
    name: "setGroups",
    keyName: "fieldId",
  });

  const onSubmit = (data) => console.log(JSON.stringify(data, null, 4));
  const submit = () => {
    handleSubmit(onSubmit)();
  };

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
    // updateWorkout.dispatch({
    //   id: workoutData.id,
    //   done: true,
    // });
    // onClose();
    console.log(methods.getValues().setGroups.map((s) => s.exercise.name));
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
        <SetGroupList
          fields={fields}
          methods={methods}
          move={move}
          openExercisePicker={openExercisePicker}
          submit={submit}
        />
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
  return {
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
  };
});
