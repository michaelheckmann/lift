import Icon from "@expo/vector-icons/Ionicons";
import { Input, makeStyles } from "@rneui/themed";
import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useBlockStore } from "src/store";
import { createExercise } from "src/store/actions/exerciseActions";
import { ExerciseSlice } from "src/utils/types/Exercise";

const WINDOW_HEIGHT = Dimensions.get("window").height;

type RenderItem = {
  item: ExerciseSlice;
  index: number;
  logExercise: (exercise: ExerciseSlice) => void;
};

const renderItem = ({ item, index, logExercise }: RenderItem) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: index % 2 === 0 ? "gray" : "white",
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "black",
      }}
      onPress={() => logExercise(item)}
    >
      <Text style={{ color: index % 2 === 0 ? "white" : "black" }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default function ExercisePicker({ closeDialog, onExerciseSelected }) {
  const styles = useStyles();
  const exercises = useBlockStore((state) => state.exercises);
  const logExercise = (item: ExerciseSlice) => {
    onExerciseSelected(item);
    closeDialog();
  };

  const [newExercise, setNewExercise] = useState("");

  const addExercise = () => {
    createExercise.dispatch({ name: newExercise });
    setNewExercise("");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <Text>ExercisePicker</Text>
        <Text onPress={closeDialog}>Close</Text>
      </View>
      <Input
        returnKeyType="done"
        onSubmitEditing={addExercise}
        placeholder="Add an exercise"
        value={newExercise}
        keyboardType="default"
        autoCapitalize="words"
        autoCorrect={false}
        inputContainerStyle={styles.input}
        onChangeText={(text) => setNewExercise(text)}
        leftIcon={<Icon name="add-circle" size={18} />}
      />

      <KeyboardAwareFlatList
        data={exercises}
        renderItem={({ item, index }) =>
          renderItem({ item, index, logExercise })
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    height: WINDOW_HEIGHT * 0.7,
  },
  input: {
    minWidth: 0,
    width: "100%",
  },
}));
