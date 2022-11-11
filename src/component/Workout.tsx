import { Button, makeStyles } from "@rneui/themed";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createSetGroup } from "src/store/actions/setgroupActions";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

import SetGroup from "./SetGroup";

type Props = {
  onClose: () => void;
  workoutData: Partial<WorkoutJoin>;
  isCollapsed: boolean;
};

export default function Workout({ onClose, workoutData, isCollapsed }: Props) {
  const styles = useStyles({ isCollapsed });

  const methods = useForm<WorkoutJoin>({
    defaultValues: workoutData,
  });
  const { control, handleSubmit } = methods;
  const { fields, append } = useFieldArray({
    control,
    name: "setGroups",
    keyName: "fieldId",
  });

  const onSubmit = (data) => console.log(JSON.stringify(data, null, 4));
  const handleAppendSetGroup = () => {
    const defaultSetGroup = {
      order: fields.length + 1,
      exercise_id: "xrc_3f3885226027_53",
      exercise: {
        id: "xrc_3f3885226027_53",
        name: "Bench Press",
        archived: false,
      },
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Button
          buttonStyle={styles.headerButton}
          titleStyle={styles.headerButtonText}
          title="Workout"
          onPress={onClose}
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
            onPress={handleAppendSetGroup}
          />
          <Button
            style={{ marginBottom: 20 }}
            title="submit"
            onPress={handleSubmit(onSubmit)}
          />
        </KeyboardAwareScrollView>
      )}
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
}));
