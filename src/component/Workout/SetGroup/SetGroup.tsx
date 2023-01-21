import MIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { makeStyles, useTheme } from "@rneui/themed";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";
import QuickMenu, { QuickMenuOptionType } from "src/component/Shared/QuickMenu";
import {
  deleteSetGroup,
  updateSetGroup,
} from "src/store/actions/setgroupActions";
import { getSetGroupHeaderHeight } from "src/utils/functions/getSetGroupLayouts";
import { computeLayoutOffset } from "src/utils/functions/listLayoutHelpers";
import { moveArrayItem } from "src/utils/functions/moveArrayItem";
import { usePrevious } from "src/utils/hooks/usePrevious";
import { useShadow } from "src/utils/hooks/useShadow";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import { ListItemLayout } from "../Workout/Workout";
import SetGroupContent from "./SetGroupContent";

type Props = {
  setGroup: FieldArrayWithId<WorkoutJoin, "setGroups", "fieldId">;
  setGroupIndex: number;
  methods: UseFormReturn<WorkoutJoin, any>;
  fieldArrayOps: UseFieldArrayReturn<WorkoutJoin, "setGroups", "fieldId">;
  listLayout: SharedValue<ListItemLayout[]>;
  tightLayoutOrder: SharedValue<number[]>;
  reorderIndex: number;
  setReorderIndex: Dispatch<SetStateAction<number>>;
};

export default function SetGroup({
  methods,
  setGroup,
  setGroupIndex,
  fieldArrayOps,
  listLayout,
  tightLayoutOrder,
  reorderIndex,
  setReorderIndex,
}: Props) {
  const shadow = useShadow();
  const shadowElevated = useShadow(3);
  const styles = useStyles({
    shadow,
  });
  const { theme } = useTheme();
  const headerHeight = getSetGroupHeaderHeight(theme.spacing);

  const { move, remove } = fieldArrayOps;

  // This is the top position of the set group in the list
  const top = useSharedValue(listLayout.value[setGroupIndex].relaxed.top);
  // This is the height of the set group in the list
  const height = useSharedValue(listLayout.value[setGroupIndex].relaxed.height);

  // This is the index of the set group during reordering
  const [tightOrderIndex, setTightOrderIndex] = useState(0);
  useAnimatedReaction(
    () => tightLayoutOrder.value,
    (o) => {
      runOnJS(setTightOrderIndex)(o.indexOf(setGroupIndex));
    }
  );

  const initReordering = () => {
    setReorderIndex(setGroupIndex);
  };

  const previousSetGroupIndex = usePrevious(setGroupIndex);

  useEffect(() => {
    // If the set group has just been added, do nothing
    if (previousSetGroupIndex === undefined) return;
    // If the set group index has not changed, do nothing
    if (previousSetGroupIndex === setGroupIndex) return;
    // If the set group index has changed, update the remote state
    updateSetGroup.dispatch({
      id: setGroup.id,
      order: setGroupIndex,
    });
  }, [setGroupIndex]);

  // This hook is used to alternate between the relaxed and tight layouts
  useAnimatedReaction(
    // The first parameter of the callback function is a function that returns the
    // current value of the listLayout variable. This is a variable that contains
    // the layout of each item in the list. It is created in the previous step.
    () => listLayout.value[setGroupIndex],
    // The second parameter of the callback function is the callback function itself.
    // It is called when the dependencies change. In this case, the dependencies are
    // the reorderIndex variable, which is a variable that contains the index of the
    // item that is currently being dragged and the listLayout shared value.
    (layout) => {
      // The reorderIndex variable is initialized to -1. When it is -1, that means
      // that there is no item being dragged, so we want to animate the position
      // of the set group to its relaxed position.
      if (reorderIndex === -1) {
        top.value = withSpring(layout.relaxed.top, { damping: 100 });
        height.value = withDelay(
          100,
          withTiming(layout.relaxed.height, { duration: 100 })
        );
      } else {
        // When the reorderIndex variable is not -1, that means that there is an
        // item being dragged, so we want to animate the position of the set group
        // to its tight position.
        height.value = withTiming(layout.tight.height);
        top.value = withDelay(100, withTiming(layout.tight.top));
      }
    },
    // The third parameter of the callback function is an array of dependencies. In
    // this case, the dependency is the reorderIndex variable.
    [reorderIndex, setGroupIndex]
  );

  // This is used to animate the set groups out of the way
  // of the set group that is currently being dragged.
  useAnimatedReaction(
    // Observe the current layout order of the tight layout
    () => tightLayoutOrder.value,
    (o, v) => {
      // If the user is not dragging a set group, do nothing
      if (reorderIndex === -1) return;
      // If the user is dragging the set group itself, do nothing
      if (reorderIndex === setGroupIndex) return;
      // If the number of set groups has changed, then we cannot
      // compare the old and new layout orders, so do nothing
      if (o.length !== v.length) return;
      // If the set groups are in the same order, do nothing
      if (o.every((x, i) => x === v[i])) return;
      // Find the new index of the set group in the tight layout
      const newIndex = o.findIndex((x) => x === setGroupIndex);
      // Animate the current top value to the top value of the new index in the tight layout
      top.value = withTiming(listLayout.value[newIndex].tight.top);
    },
    [reorderIndex]
  );

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

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: top.value,
      height: height.value,
      zIndex: reorderIndex === setGroupIndex ? 1 : 0,
      shadowColor: shadowElevated.shadowColor,
      shadowOffset: shadowElevated.shadowOffset,
      shadowRadius: shadowElevated.shadowRadius,
      shadowOpacity: withTiming(
        reorderIndex === setGroupIndex ? shadowElevated.shadowOpacity : 0
      ),
    };
  }, [reorderIndex]);

  const [setGroupMenuVisible, setSetGroupMenuVisible] = useState(false);

  const ref = useRef<Animated.View>(null);
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);

  const openSetGroupMenu = () => {
    ref.current.measureInWindow((x, y) => {
      xPosition.value = x;
      yPosition.value = y;
      setSetGroupMenuVisible(true);
    });
  };
  const closeSetGroupMenu = () => setSetGroupMenuVisible(false);

  const handleDeleteSetGroup = () => {
    closeSetGroupMenu();
    deleteSetGroup(setGroup);
    // Recompute the layout of the set groups
    // without the set group that was just deleted
    const newList = listLayout.value
      .slice()
      .filter((_, index) => index !== setGroupIndex);
    listLayout.value = newList.map((item, index) => {
      return {
        relaxed: {
          top: computeLayoutOffset(newList, index),
          height: item.relaxed.height,
        },
        tight: item.tight,
      };
    });
    remove(setGroupIndex);
  };

  const setGroupMenuOptions: QuickMenuOptionType[] = [
    {
      label: "Delete",
      icon: "trash-outline",
      onPress: handleDeleteSetGroup,
    },
  ];

  return (
    <Animated.View style={[styles.container, animatedStyles]} ref={ref}>
      {/* Set Group Header */}
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
          <Text style={styles.headerButtonText}>
            {setGroup?.exercise?.name}
          </Text>
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

      <SetGroupContent
        methods={methods}
        setGroupIndex={setGroupIndex}
        setGroup={setGroup}
        listLayout={listLayout}
      />

      <Modal
        isVisible={setGroupMenuVisible}
        onBackdropPress={closeSetGroupMenu}
        backdropOpacity={0.4}
        animationInTiming={10}
        animationIn="zoomIn"
        animationOut="fadeOut"
        animationOutTiming={200}
      >
        <QuickMenu
          yPosition={yPosition}
          xPosition={xPosition}
          options={setGroupMenuOptions}
        />
      </Modal>
    </Animated.View>
  );
}

const useStyles = makeStyles((theme, { shadow }) => {
  const { colors, spacing, borderRadius } = theme;
  return {
    container: {
      position: "absolute",
      width: "100%",
      overflow: "hidden",
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
  };
});
