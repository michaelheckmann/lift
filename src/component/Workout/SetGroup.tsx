import { Button, makeStyles } from "@rneui/themed";
import React from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { createSet, updateSet } from "src/store/actions/setActions";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import Set from "./Set";

type Props = {
  setGroup: FieldArrayWithId<WorkoutJoin, "setGroups", "id">;
  setGroupIndex: number;
  methods: UseFormReturn<WorkoutJoin, any>;
};

const renderLeftActions = (remove) => {
  return (
    <RectButton
      style={{
        backgroundColor: "red",
        width: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={remove}
    >
      <Text style={{ fontWeight: "bold", color: "white" }}>Archive</Text>
    </RectButton>
  );
};

export default function SetGroup({ setGroup, setGroupIndex, methods }: Props) {
  const styles = useStyles();

  const { control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `setGroups.${setGroupIndex}.sets` as "setGroups.0.sets",
    keyName: "fieldId",
  });

  const handleAppendSet = () => {
    const defaultSet = {
      weight: 0,
      reps: 0,
      done: false,
      archived: false,
      setgroup_id: setGroup.id,
    };
    const id = createSet.dispatch({
      setgroup_id: defaultSet.setgroup_id,
    });

    append({ ...defaultSet, id });
  };

  const handleRemoveSet = (setIndex) => {
    remove(setIndex);
    updateSet.dispatch({
      id: fields[setIndex].id,
      archived: true,
    });
  };

  return (
    <View style={styles.container}>
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
          <View key={set.fieldId} style={{ marginBottom: 10 }}>
            <Swipeable
              renderRightActions={() =>
                renderLeftActions(() => handleRemoveSet(setIndex))
              }
              rightThreshold={40}
              overshootFriction={8}
              shouldCancelWhenOutside
              containerStyle={{ backgroundColor: "red" }}
            >
              <Set
                set={set}
                setIndex={setIndex}
                setGroupIndex={setGroupIndex}
                methods={methods}
              />
            </Swipeable>
          </View>
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
      <Button title="Add set" onPress={handleAppendSet} />
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

const useStyles = makeStyles(({ colors, spacing, borderRadius }) => ({
  container: {
    width: "100%",
    marginBottom: spacing["4"],
  },
  header: {
    flexDirection: "row",
    marginBottom: spacing.xl,
  },
  headerButton: {
    backgroundColor: colors.background,
    borderWidth: spacing["0.5"],
    borderColor: colors.grey3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  headerButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.black,
  },
  setGroupOptions: { height: 55, width: 55, marginRight: spacing.xl },
  exercise: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flex: 1,
  },
  setsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  setsHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.black,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "black",
  },
}));
