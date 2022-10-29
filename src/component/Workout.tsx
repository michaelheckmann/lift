import { Button, makeStyles } from "@rneui/themed";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { View } from "react-native";
import {
  Set as SetType,
  SetGroup as SetGroupType,
  Workout as WorkoutType,
} from "utils/types/Workout";
import SetGroup from "./SetGroup";

type Props = {
  onClose: () => void;
  workoutData: Partial<WorkoutType>;
  isCollapsed: boolean;
};

export type WorkoutForm = {
  setGroups?: SetGroupType[];
};

export const defaultSet: SetType = {
  set_type: "normal",
  reps: undefined,
  weight: undefined,
  done: false,
  order: 1,
};

const defaultSetGroup: SetGroupType = {
  exercise: {
    name: "Bench Press",
  },
  order: 1,
  sets: [defaultSet],
};

export default function Workout({ onClose, workoutData, isCollapsed }: Props) {
  const styles = useStyles({ isCollapsed });

  const methods = useForm<WorkoutForm>();
  const { control, handleSubmit } = methods;
  const { fields, append } = useFieldArray({
    control,
    name: "setGroups",
  });

  const onSubmit = (data) => console.log(JSON.stringify(data, null, 4));

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
        <View style={styles.form}>
          {fields.map((setGroup, setGroupIndex) => {
            return (
              <SetGroup
                key={setGroup.id}
                setGroup={setGroup}
                setGroupIndex={setGroupIndex}
                methods={methods}
              />
            );
          })}

          <Button
            style={{ marginBottom: 20 }}
            title="append setgroup"
            onPress={() => append(defaultSetGroup)}
          />
          <Button
            style={{ marginBottom: 20 }}
            title="submit"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
}));
