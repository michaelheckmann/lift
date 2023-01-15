import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { makeStyles, useTheme } from "@rneui/themed";
import React, { useEffect, useMemo } from "react";
import { FieldArrayWithId, UseFormReturn, useWatch } from "react-hook-form";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RenderItemParams } from "react-native-draggable-flatlist";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getSetGroupContentHeight } from "src/utils/functions/getSetGroupHeights";
import { useShadow } from "src/utils/hooks/useShadow";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import SetGroupContent from "./SetGroupContent";

// This should be in the SetGroupList component
// but it's here to avoid a circular dependency
export const listAnimationConfig = {
  duration: 200,
  easing: Easing.ease,
};

type Props = {
  renderItemProps: RenderItemParams<
    FieldArrayWithId<WorkoutJoin, "setGroups", "fieldId">
  >;
  methods: UseFormReturn<WorkoutJoin, any>;
  reorderingItem: number;
  setReorderingItem: React.Dispatch<React.SetStateAction<number>>;
};

export default function SetGroup({
  methods,
  renderItemProps,
  reorderingItem,
  setReorderingItem,
}: Props) {
  const shadow = useShadow();
  const styles = useStyles({
    shadow,
  });
  const { theme } = useTheme();

  const { item: setGroup, getIndex, drag, isActive } = renderItemProps;
  const setGroupIndex = getIndex();

  // This is necessary to make sure the set group content
  // is rendered correctly when the user has reordered the list
  // Else there might be artifacts where the addSet button is
  // misaligned
  const showSetGroupContent = useMemo(() => {
    return reorderingItem === -1;
  }, [reorderingItem]);

  const path = `setGroups.${setGroupIndex}.sets` as `setGroups.0.sets`;
  const numberOfSets = useWatch({
    control: methods.control,
    name: path,
  }).length;

  const setGroupContentHeight = useSharedValue(0);

  useEffect(() => {
    if (reorderingItem === -1) {
      setGroupContentHeight.value = getSetGroupContentHeight(
        theme.spacing,
        numberOfSets
      );
    } else {
      setGroupContentHeight.value = 0;
    }
  }, [numberOfSets, reorderingItem]);

  const handleLongPress = () => {
    setReorderingItem(setGroupIndex);
  };

  const handleDrag = () => {
    "worklet";
    if (reorderingItem === setGroupIndex) {
      runOnJS(drag)();
    }
  };

  const setGroupContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        setGroupContentHeight.value,
        listAnimationConfig,
        handleDrag
      ),
    };
  });

  return (
    <Animated.View style={[styles.container]}>
      {/* Set Group Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.headerButton, styles.setGroupOptions]}>
          <Text style={styles.headerButtonText}>{setGroupIndex + 1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.headerButton, styles.exercise]}>
          <Text style={styles.headerButtonText}>{setGroup.exercise.name}</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback
          style={styles.dragAffordance}
          onLongPress={handleLongPress}
          disabled={isActive}
        >
          <MIcon
            name="drag"
            size={theme.spacing["8"]}
            color={theme.colors.gray200}
          />
        </TouchableWithoutFeedback>
      </View>

      <Animated.View
        style={[styles.setGroupContentContainer, setGroupContentAnimatedStyle]}
      >
        {showSetGroupContent && (
          <SetGroupContent
            methods={methods}
            setGroupIndex={setGroupIndex}
            setGroup={setGroup}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const useStyles = makeStyles((theme, { shadow }) => {
  const { colors, spacing, borderRadius } = theme;
  return {
    container: {
      width: "100%",
    },
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
    setGroupContentContainer: {
      overflow: "hidden",
    },
  };
});
