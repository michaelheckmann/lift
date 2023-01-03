import { makeStyles } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { getThemeConfig } from "src/utils/functions/getThemeConfig";

export default function WorkoutHeader({
  isCollapsed,
  handleFinish,
  setExpanded,
}) {
  const styles = useStyles({ isCollapsed });

  return (
    <Animated.View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={isCollapsed ? 0.2 : 1}
        disabled={!isCollapsed}
        onPress={setExpanded}
      >
        {!isCollapsed && (
          <View style={styles.dragAffordanceContainer}>
            <View style={styles.dragAffordance} />
          </View>
        )}
        <TouchableOpacity
          activeOpacity={isCollapsed ? 1 : 0.2}
          disabled={isCollapsed}
          onPress={handleFinish}
        >
          <Text style={styles.heading}>Workout</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const useStyles = makeStyles((theme, { isCollapsed }) => {
  const { spacing, borderRadius, mode } = theme;
  return {
    headerContainer: {
      width: "100%",
      marginBottom: isCollapsed ? 0 : spacing[2],
      height: isCollapsed ? spacing["20"] : "auto",
      justifyContent: isCollapsed ? "center" : "space-between",
      alignItems: isCollapsed ? "center" : "stretch",
    },
    heading: {
      fontSize: spacing["7"],
      fontWeight: "bold",
      marginTop: isCollapsed ? 0 : spacing[4],
      marginBottom: isCollapsed ? 0 : spacing[4],
      color: getThemeConfig("Workout.heading.color", theme),
    },
    dragAffordanceContainer: {
      width: "100%",
    },
    dragAffordance: {
      height: spacing["1.5"],
      width: spacing["12"],
      backgroundColor: mode === "dark" ? "white" : "black",
      borderRadius: borderRadius.full,
      marginTop: spacing["0.5"],
      marginBottom: spacing["0.5"],
      alignSelf: "center",
      opacity: 0.5,
    },
  };
});
