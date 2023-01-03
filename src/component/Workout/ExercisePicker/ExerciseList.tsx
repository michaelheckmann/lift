import { makeStyles } from "@rneui/themed";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { getThemeConfig } from "src/utils/functions/getThemeConfig";
import { ExerciseSlice } from "src/utils/types/Exercise";

type RenderItem = {
  item: ExerciseSlice;
  setSelectedExercises: React.Dispatch<React.SetStateAction<ExerciseSlice[]>>;
  styles: ReturnType<typeof useStyles>;
  index: number;
  stickyHeaders: number[];
  isSelected: boolean;
};

const renderItem = ({
  item,
  setSelectedExercises,
  styles,
  index,
  stickyHeaders,
  isSelected,
}: RenderItem) => {
  const isStickyHeader = stickyHeaders.includes(index);
  const isItemBeforeHeader = stickyHeaders.includes(index + 1);
  const handleSelect = () => {
    // Deselect if already selected
    if (isSelected) {
      setSelectedExercises((exercises) =>
        exercises.filter((exercise) => exercise.id !== item.id)
      );
    } else {
      setSelectedExercises((exercises) => [...exercises, item]);
    }
  };
  if (isStickyHeader) {
    return (
      <View style={styles.stickyItem}>
        <Text style={styles.stickyItemText}>{item.name}</Text>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={[
          styles.renderItem,
          isItemBeforeHeader && styles.renderItemBeforeHeader,
          isSelected && styles.renderItemSelected,
        ]}
        onPress={handleSelect}
      >
        <Text style={styles.renderItemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
};

export default function ExerciseList({
  exerciseList,
  stickyHeaderIndizes,
  selectedExercises,
  setSelectedExercises,
}) {
  const styles = useStyles();
  const isSelected = (id: string) =>
    selectedExercises.map((e) => e.id).includes(id);
  return (
    <KeyboardAwareFlatList
      data={exerciseList}
      stickyHeaderIndices={stickyHeaderIndizes}
      renderItem={({ item, index }) =>
        renderItem({
          item,
          setSelectedExercises,
          styles,
          index,
          stickyHeaders: stickyHeaderIndizes,
          isSelected: isSelected(item.id),
        })
      }
      keyExtractor={(item, index) => item.id + index}
    />
  );
}

const useStyles = makeStyles((theme) => {
  const { colors, spacing } = theme;
  return {
    stickyItem: {
      backgroundColor: getThemeConfig(
        "ExercisePicker.stickyItem.backgroundColor",
        theme
      ),
      paddingVertical: spacing["1"],
      paddingHorizontal: spacing["4"],
      borderTopWidth: spacing["0.5"],
      borderBottomWidth: spacing["0.5"],
      borderColor: getThemeConfig(
        "ExercisePicker.stickyItem.borderColor",
        theme
      ),
    },
    stickyItemText: {
      fontWeight: "bold",
      color: getThemeConfig("ExercisePicker.stickyItem.color", theme),
    },
    renderItem: {
      backgroundColor: getThemeConfig(
        "ExercisePicker.renderItem.backgroundColor",
        theme
      ),
      paddingVertical: spacing["6"],
      paddingHorizontal: spacing["4"],
      borderBottomWidth: spacing["0.5"],
      borderColor: colors.border,
    },
    renderItemBeforeHeader: {
      borderBottomWidth: 0,
    },
    renderItemSelected: {
      backgroundColor: getThemeConfig(
        "ExercisePicker.renderItemSelected.backgroundColor",
        theme
      ),
    },
    renderItemText: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: spacing["4"],
    },
  };
});
