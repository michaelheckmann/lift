import { makeStyles } from "@rneui/themed";
import * as Haptics from "expo-haptics";
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
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { QuickMenuOptionType } from "src/component/Shared/QuickMenu";
import QuickMenuModal from "src/component/Shared/QuickMenuModal";
import {
  deleteSetGroup,
  updateSetGroup,
} from "src/store/actions/setgroupActions";
import { computeLayoutOffset } from "src/utils/functions/listLayoutHelpers";
import { usePrevious } from "src/utils/hooks/usePrevious";
import { useShadow } from "src/utils/hooks/useShadow";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import { ListItemLayout } from "../Workout/Workout";
import SetGroupContent from "./SetGroupContent";
import SetGroupHeader from "./SetGroupHeader";

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
  const shadow = useShadow(3);
  const styles = useStyles();
  const { move, remove } = fieldArrayOps;

  // This is the top position of the set group in the list
  const top = useSharedValue(listLayout.value[setGroupIndex].relaxed.top);
  // This is the height of the set group in the list
  const height = useSharedValue(listLayout.value[setGroupIndex].relaxed.height);

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
    // this case, the dependency is the reorderIndex and setGroupIndex variable.
    // The setGroupIndex variable is necessary to trigger a re-evaluation
    // of the callback function when a setGroup is removed.
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
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    },
    [reorderIndex]
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: top.value,
      height: height.value,
      zIndex: reorderIndex === setGroupIndex ? 1 : 0,
      shadowColor: shadow.shadowColor,
      shadowOffset: shadow.shadowOffset,
      shadowRadius: shadow.shadowRadius,
      shadowOpacity: withTiming(
        reorderIndex === setGroupIndex ? shadow.shadowOpacity : 0
      ),
    };
  }, [reorderIndex]);

  const [setGroupMenuVisible, setSetGroupMenuVisible] = useState(false);

  const ref = useRef<Animated.View>(null);
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);

  const openSetGroupMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    ref.current.measureInWindow((x, y) => {
      xPosition.value = x;
      yPosition.value = y;

      setSetGroupMenuVisible(true);
    });
  };
  const closeSetGroupMenu = () => setSetGroupMenuVisible(false);

  const handleDeleteSetGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      label: "Add a note",
      icon: "document-text-outline",
      onPress: () => {
        console.log("Add a note");
        closeSetGroupMenu();
      },
    },
    {
      label: "Replace exercise",
      icon: "refresh-outline",
      onPress: () => {
        console.log("Replace exercise");
        closeSetGroupMenu();
      },
    },
    {
      label: "Delete",
      icon: "trash-outline",
      onPress: handleDeleteSetGroup,
      isSecondary: true,
    },
  ];

  return (
    <Animated.View style={[styles.container, animatedStyles]} ref={ref}>
      {/* Set Group Header */}
      <SetGroupHeader
        reorderIndex={reorderIndex}
        setReorderIndex={setReorderIndex}
        exerciseName={setGroup?.exercise?.name}
        setGroupIndex={setGroupIndex}
        tightLayoutOrder={tightLayoutOrder}
        openSetGroupMenu={openSetGroupMenu}
        top={top}
        listLayout={listLayout}
        move={move}
      />

      <SetGroupContent
        methods={methods}
        setGroupIndex={setGroupIndex}
        setGroup={setGroup}
        listLayout={listLayout}
      />

      <QuickMenuModal
        xPosition={xPosition}
        yPosition={yPosition}
        menuOptions={setGroupMenuOptions}
        menuVisible={setGroupMenuVisible}
        setMenuVisible={setSetGroupMenuVisible}
      />
    </Animated.View>
  );
}

const useStyles = makeStyles(() => {
  return {
    container: {
      position: "absolute",
      width: "100%",
      overflow: "hidden",
    },
  };
});
