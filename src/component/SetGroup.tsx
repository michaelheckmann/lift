import { Button, makeStyles } from "@rneui/themed";
import React from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Set from "./Set";
import { defaultSet, WorkoutForm } from "./Workout";

type Props = {
  setGroup: FieldArrayWithId<WorkoutForm, "setGroups", "id">;
  setGroupIndex: number;
  methods: UseFormReturn<WorkoutForm, any>;
};

export default function SetGroup({ setGroup, setGroupIndex, methods }: Props) {
  const styles = useStyles();

  const { control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `setGroups.${setGroupIndex}.sets` as "setGroups.0.sets",
  });

  return (
    <View style={styles.container} key={setGroup.id}>
      {/* Set Group Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.headerButton, styles.setGroupOptions]}>
          <Text style={styles.headerButtonText}>{setGroupIndex + 1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.headerButton, styles.exercise]}>
          <Text style={styles.headerButtonText}>{setGroup.exercise.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Set Header */}
      <SetHeader styles={styles} />

      {/* Sets */}
      <View>
        {fields.map((set, setIndex) => (
          <Set key={set.id} set={set} setIndex={setIndex} methods={methods} />
        ))}
      </View>

      {/* <Controller
        control={control}
        name={`setGroups.${setGroupIndex}.exercise.name`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        
      /> */}
      <Button title="Add set" onPress={() => append(defaultSet)} />
    </View>
  );
}

const SetHeader = ({ styles }) => {
  return (
    <View style={styles.setsHeader}>
      <Text style={styles.setsHeaderText}>Set</Text>
      <Text style={styles.setsHeaderText}>Previous</Text>
      <Text style={styles.setsHeaderText}>KG</Text>
      <Text style={styles.setsHeaderText}>Reps</Text>
      <Text style={styles.setsHeaderText}>✓</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    marginBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: "row",
    marginBottom: theme.spacing.xl,
  },
  headerButton: {
    backgroundColor: theme.colors.grey0,
    borderWidth: theme.border.width.md,
    borderColor: theme.colors.grey3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.border.radius.sm,
  },
  headerButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.black,
  },
  setGroupOptions: { height: 55, width: 55, marginRight: theme.spacing.xl },
  exercise: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    flex: 1,
  },
  setsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  setsHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.black,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "black",
  },
}));
