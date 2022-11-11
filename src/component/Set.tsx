import React from "react";
import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { Text, View } from "react-native";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

type Props = {
  set: FieldArrayWithId<WorkoutJoin, "setGroups.0.sets", "id">;
  setIndex: number;
  methods: UseFormReturn<WorkoutJoin, any>;
};

export default function Set({ set, setIndex, methods }: Props) {
  return (
    <View key={set.id}>
      <Text>Set {setIndex}</Text>
    </View>
  );
}
