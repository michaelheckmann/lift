import Icon from "@expo/vector-icons/Ionicons";
import { makeStyles, useTheme } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

export default function WorkoutHeader({
  isCollapsed,
  handleFinish,
  setExpanded,
}) {
  const styles = useStyles({ isCollapsed });
  const { theme } = useTheme();

  return (
    <Animated.View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={isCollapsed ? 0.2 : 1}
        disabled={!isCollapsed}
        onPress={setExpanded}
        style={{ height: "100%" }}
      >
        {/* Drag Affordance */}
        {!isCollapsed && (
          <View style={styles.dragAffordanceContainer}>
            <View style={styles.dragAffordance} />
          </View>
        )}

        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconContainer}>
            <Icon
              name="timer-outline"
              size={theme.spacing["6"]}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeContainer}>
            <Text style={styles.time}>00:00</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Icon
              name="list-outline"
              size={theme.spacing["6"]}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const useStyles = makeStyles((theme, { isCollapsed }) => {
  const { spacing, borderRadius, mode, colors } = theme;
  return {
    headerContainer: {
      width: "100%",
      marginBottom: isCollapsed ? 0 : spacing["2"],
      height: isCollapsed ? spacing["20"] : spacing["20"],
      justifyContent: isCollapsed ? "center" : "flex-start",
      alignItems: isCollapsed ? "center" : "stretch",
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
    headerBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      // headerContainer height - dragAffordanceContainer height
      // - dragAffordance marginTop - dragAffordance marginBottom
      height: spacing["20"] - spacing["1.5"] - spacing["0.5"] * 2,
      paddingHorizontal: spacing["0.5"],
    },
    iconContainer: {
      width: spacing["10"],
      height: spacing["10"],
      borderRadius: borderRadius.sm,
      backgroundColor: colors.gray200,
      justifyContent: "center",
      alignItems: "center",
    },
    timeContainer: {
      flex: 1,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.gray200,
      marginLeft: spacing["2"],
      marginRight: spacing["2"],
      height: spacing["10"],
      justifyContent: "center",
      alignItems: "center",
    },
    time: {
      fontSize: spacing["5"],
      fontWeight: "bold",
      letterSpacing: spacing["0.5"],
      color: colors.text,
    },
  };
});
