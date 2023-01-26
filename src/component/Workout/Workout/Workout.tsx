import { makeStyles, useTheme } from "@rneui/themed";
import * as Haptics from "expo-haptics";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import Modal from "react-native-modal";
import { useSharedValue } from "react-native-reanimated";
import { createSetGroup } from "src/store/actions/setgroupActions";
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

export type FinishedSet = {
  id: string;
  exercise: ExerciseSlice;
};

type Props = {
  onClose: () => void;
  workoutData: Partial<WorkoutJoin>;
  isCollapsed: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
};

export default function Workout({
  onClose,
  workoutData,
  isCollapsed,
  setExpanded,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();

  const [exercisePickerVisible, setExercisePickerVisible] = useState(false);

  // This is used to compute the layout of the set group list
  // This is necessary as all the set groups are positioned absolutely
  const listLayout = useSharedValue<ListItemLayout[]>([]);

  /* Definition of the form values and methods */
  const methods = useForm<WorkoutJoin>({
    defaultValues: useMemo(() => workoutData, [workoutData]),
  });
  const { control, handleSubmit, reset } = methods;
  const fieldArrayOps = useFieldArray({
    control,
    name: "setGroups",
    keyName: "fieldId",
  });
  const { fields, append } = fieldArrayOps;

  // This is used to trigger the countdown
  const setGroups = useWatch({
    control,
    name: "setGroups",
  });
  const [finishedSets, setFinishedSets] = useState<FinishedSet[]>([]);
  const [countdownTrigger, setCountdownTrigger] = useState<FinishedSet | null>(
    null
  );

  useEffect(() => {
    // This code checks if a set has been marked as completed
    // and adds it to the finished set if it hasn't been added yet.
    // If a set has been marked as incomplete and was already added
    // to the finished set, it is removed from the finished set.
    let newFinishedSet: FinishedSet | null = null;
    let removedSet: FinishedSet | null = null;
    if (setGroups && setGroups.length > 0) {
      setGroups.forEach((setGroup) => {
        if (setGroup.sets.length > 0) {
          setGroup.sets.forEach((set) => {
            if (set.done && !finishedSets.some((s) => s.id === set.id)) {
              newFinishedSet = {
                id: set.id,
                exercise: setGroup.exercise,
              };
            } else if (!set.done && finishedSets.some((s) => s.id === set.id)) {
              removedSet = {
                id: set.id,
                exercise: setGroup.exercise,
              };
            }
          });
        }
      });
    }
    if (newFinishedSet) {
      setFinishedSets([...finishedSets, newFinishedSet]);
      setCountdownTrigger(newFinishedSet);
    }
    if (removedSet) {
      setFinishedSets(finishedSets.filter((s) => s.id !== removedSet.id));
    }
  }, [setGroups]);

  const onSubmit = (data) => console.log(JSON.stringify(data, null, 4));
  const submit = () => {
    handleSubmit(onSubmit)();
  };

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
    reset(workoutData);

    // Initialize the list layout
    if (workoutData?.setGroups?.length > 0) {
      const computedHeights: ListItemLayout[] = workoutData.setGroups.map(
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
    }
  }, [workoutData]);

  const openExercisePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log(methods.getValues().setGroups.map((s) => s.exercise.name));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <WorkoutHeader
        isCollapsed={isCollapsed}
        handleFinish={handleFinish}
        setExpanded={setExpanded}
        countdownTrigger={countdownTrigger}
        setCountdownTrigger={setCountdownTrigger}
      />

      {!isCollapsed && (
        <SetGroupList
          fields={fields}
          methods={methods}
          fieldArrayOps={fieldArrayOps}
          openExercisePicker={openExercisePicker}
          submit={submit}
          listLayout={listLayout}
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

const useStyles = makeStyles(() => {
  return {
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
  };
});
