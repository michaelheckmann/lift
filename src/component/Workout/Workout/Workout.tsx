import { makeStyles, useTheme } from "@rneui/themed";
import * as Haptics from "expo-haptics";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";
import Modal from "react-native-modal";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { createSetGroup } from "src/store/actions/setgroupActions";
import { updateWorkout } from "src/store/actions/workoutsActions";
import {
  getSetGroupHeaderHeight,
  getSetGroupHeight,
} from "src/utils/functions/getSetGroupLayouts";
import { computeLayoutOffset } from "src/utils/functions/listLayoutHelpers";
import { ExerciseSlice } from "src/utils/types/Exercise";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import ExercisePicker from "../ExercisePicker/ExercisePicker";
import SetGroupList from "./SetGroupList";
import WorkoutHeader from "./WorkoutHeader";

export type ListItemLayout = {
  relaxed: {
    top: number;
    height: number;
  };
  tight: {
    top: number;
    height: number;
  };
};

type Props = {
  onClose: () => void;
  workoutData: Partial<WorkoutJoin>;
  isCollapsed: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
  moveStarted: boolean;
};

function prepareWorkoutData(workout: Partial<WorkoutJoin>): WorkoutJoin {
  const defaultWorkout: WorkoutJoin = {
    id: "0",
    archived: false,
    done: false,
    setGroups: [],
    created_at: new Date(),
  };
  return { ...defaultWorkout, ...workout };
}

export default function Workout({
  onClose,
  workoutData,
  isCollapsed,
  setExpanded,
  moveStarted,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();

  const [exercisePickerVisible, setExercisePickerVisible] = useState(false);

  // This is used to compute the layout of the set group list
  // This is necessary as all the set groups are positioned absolutely
  const listLayout = useSharedValue<ListItemLayout[]>([]);

  /* Definition of the form values and methods */
  const methods = useForm<WorkoutJoin>({
    defaultValues: workoutData,
  });

  const { control, handleSubmit, reset } = methods;
  const fieldArrayOps = useFieldArray({
    control,
    name: "setGroups",
    keyName: "fieldId",
  });
  const { fields, append } = fieldArrayOps;

  const handleAppendSetGroup = (exercise: ExerciseSlice) => {
    const defaultSetGroup = {
      // 0-indexed order in the remote state
      order: fields.length,
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

    // Update the list layout
    listLayout.value = [
      ...listLayout.value,
      {
        relaxed: {
          top: computeLayoutOffset(listLayout.value),
          height: getSetGroupHeight(theme.spacing, 0),
        },
        tight: {
          top: 0,
          height: getSetGroupHeaderHeight(theme.spacing),
        },
      },
    ];
  };

  useEffect(() => {
    const data = prepareWorkoutData(workoutData);
    reset(data);

    // Initialize the list layout
    if (data?.setGroups?.length > 0) {
      const computedHeights: ListItemLayout[] = data.setGroups.map(
        ({ sets }) => ({
          relaxed: {
            top: 0,
            height: getSetGroupHeight(theme.spacing, sets.length),
          },
          tight: {
            top: 0,
            height: getSetGroupHeaderHeight(theme.spacing),
          },
        })
      );
      listLayout.value = computedHeights.map((data, i) => ({
        relaxed: {
          top: computeLayoutOffset(computedHeights, i),
          height: data.relaxed.height,
        },
        tight: {
          top: 0,
          height: getSetGroupHeaderHeight(theme.spacing),
        },
      }));
    } else {
      listLayout.value = [];
    }
  }, [workoutData]);

  const openExercisePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExercisePickerVisible(true);
  };

  const closeExercisePicker = () => {
    setExercisePickerVisible(false);
  };

  const handleFinish = (save = true) => {
    updateWorkout.dispatch({
      id: workoutData.id,
      done: true,
      archived: !save,
    });
    onClose();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onSubmit = (data) => {
    // TODO : Validate that all sets are filled
    // Maybe do some cleanup on the data
    handleFinish(true);
  };
  const submit = () => {
    handleSubmit(onSubmit)();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(moveStarted ? 0 : isCollapsed ? 0 : 1, {
      duration: 300,
    }),
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <WorkoutHeader
        isCollapsed={isCollapsed}
        handleFinish={handleFinish}
        setExpanded={setExpanded}
      />
      <Animated.View style={[styles.setGroupList, animatedStyle]}>
        <SetGroupList
          fields={fields}
          methods={methods}
          fieldArrayOps={fieldArrayOps}
          openExercisePicker={openExercisePicker}
          submit={submit}
          listLayout={listLayout}
        />
      </Animated.View>
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

const useStyles = makeStyles(() => {
  return {
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
    setGroupList: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
  };
});
