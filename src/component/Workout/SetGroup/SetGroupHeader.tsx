import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { makeStyles, useTheme } from "@rneui/themed";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";
import { getSetGroupHeaderHeight } from "src/utils/functions/getSetGroupLayouts";
import { computeLayoutOffset } from "src/utils/functions/listLayoutHelpers";
import { moveArrayItem } from "src/utils/functions/moveArrayItem";
import { useShadow } from "src/utils/hooks/useShadow";
import { ListItemLayout } from "../Workout/Workout";

export default function SetGroupHeader({
  reorderIndex,
  setReorderIndex,
  exerciseName,
  setGroupIndex,
  tightLayoutOrder,
  openSetGroupMenu,
  top,
  listLayout,
  move,
}) {
  const shadow = useShadow();
  const styles = useStyles({
    shadow,
  });
  const { theme } = useTheme();

  const headerHeight = getSetGroupHeaderHeight(theme.spacing);

  // This is the index of the set group during reordering
  const [tightOrderIndex, setTightOrderIndex] = useState(0);
  useAnimatedReaction(
    () => tightLayoutOrder.value,
    (o) => {
      runOnJS(setTightOrderIndex)(o.indexOf(setGroupIndex));
    }
  );

  const initReordering = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setReorderIndex(setGroupIndex);
  };

  const handleOnGestureEnd = (reorderIndex: number, newIndex: number) => {
    if (reorderIndex !== newIndex) {
      // Move the set group in the local form state
      move(reorderIndex, newIndex);
    }
    // Close the reordering state
    setReorderIndex(-1);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = top.value;
    },
    onActive: ({ translationY }, { startY }) => {
      // This makes the set group follow the finger
      top.value = translationY + startY;

      // Get the offset of the set group from the initial position
      let indexOffset = Math.round(translationY / headerHeight);
      // This index stores the position in which the set group would be
      // if it were dropped in its current position
      let newIndex = setGroupIndex + indexOffset;
      // Only continue if there would be a change to the layout order
      if (tightLayoutOrder.value[newIndex] !== reorderIndex) {
        // Get the old index of the set group that is currently being dragged
        // This is not necesssarily the same as the setGroupIndex variable
        // or the reorderIndex variable, as the user may have already dragged the
        // set group to a new position
        const oldIndex = tightLayoutOrder.value.findIndex(
          (v) => v === reorderIndex
        );
        // Move the set group in the layout order
        // This triggers the useAnimatedReaction hook that we created earlier
        tightLayoutOrder.value = moveArrayItem(
          tightLayoutOrder.value,
          oldIndex,
          newIndex
        );
      }
    },
    onEnd: ({ translationY }) => {
      let indexOffset = Math.round(translationY / headerHeight);
      let newIndex = clamp(
        setGroupIndex + indexOffset,
        0,
        tightLayoutOrder.value.length - 1
      );
      const computedHeights: ListItemLayout[] = tightLayoutOrder.value.map(
        (index) => {
          return {
            relaxed: {
              top: 0,
              height: listLayout.value[index].relaxed.height,
            },
            tight: {
              top: 0,
              height: listLayout.value[index].tight.height,
            },
          };
        }
      );
      listLayout.value = computedHeights.map((data, i) => ({
        relaxed: {
          top: computeLayoutOffset(computedHeights, i),
          height: data.relaxed.height,
        },
        tight: data.tight,
      }));
      runOnJS(handleOnGestureEnd)(reorderIndex, newIndex);
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.headerButton, styles.setGroupOptions]}
        onPress={openSetGroupMenu}
      >
        <Text style={styles.headerButtonText}>
          {reorderIndex === -1 && setGroupIndex + 1}
          {reorderIndex !== -1 && tightOrderIndex + 1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerButton, styles.exercise]}>
        <Text style={styles.headerButtonText}>{exerciseName}</Text>
      </TouchableOpacity>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        onFailed={() => setReorderIndex(-1)}
        activateAfterLongPress={500}
      >
        <Animated.View>
          <TouchableWithoutFeedback
            style={styles.dragAffordance}
            onLongPress={initReordering}
            delayLongPress={200}
          >
            <MIcon
              name="drag"
              size={theme.spacing["8"]}
              color={theme.colors.gray200}
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const useStyles = makeStyles((theme, { shadow }) => {
  const { colors, spacing, borderRadius } = theme;
  return {
    header: {
      flexDirection: "row",
      marginBottom: spacing["4"],
      borderWidth: spacing["0.5"],
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.background,
      height: spacing["11"],
      justifyContent: "center",
      alignItems: "center",
      ...shadow,
    },
    headerButton: {
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    headerButtonText: {
      fontWeight: "bold",
      fontSize: spacing["4"],
      color: colors.text,
    },
    dragAffordance: {
      justifyContent: "center",
      alignItems: "center",
    },
    setGroupOptions: {
      height: spacing["10"],
      width: spacing["10"],
      backgroundColor: colors.foreground,
    },
    exercise: {
      paddingHorizontal: spacing["4"],
      flex: 1,
      alignItems: "flex-start",
      borderLeftWidth: spacing["0.5"],
      borderColor: colors.border,
    },
  };
});
