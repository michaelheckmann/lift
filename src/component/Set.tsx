import React from "react";
import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { Text, View } from "react-native";
import { WorkoutForm } from "./Workout";

type Props = {
  set: FieldArrayWithId<WorkoutForm, "setGroups.0.sets", "id">;
  setIndex: number;
  methods: UseFormReturn<WorkoutForm, any>;
};

export default function Set({ set, setIndex, methods }: Props) {
  return (
    <View key={set.id}>
      <Text>Set {setIndex}</Text>
    </View>
  );
}
