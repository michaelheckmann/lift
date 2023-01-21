import { makeStyles, useTheme } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  getSetGroupFooterHeight,
  getSetGroupHeaderHeight,
} from "src/utils/functions/getSetGroupLayouts";
import { setListLayoutValue } from "src/utils/functions/listLayoutHelpers";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import SetGroup from "../SetGroup/SetGroup";
import SetGroupListFooter from "./SetGroupListFooter";
import { ListItemLayout } from "./Workout";

type Props = {
  fields: FieldArrayWithId<WorkoutJoin, "setGroups", "fieldId">[];
  methods: UseFormReturn<WorkoutJoin, any>;
  fieldArrayOps: UseFieldArrayReturn<WorkoutJoin, "setGroups", "fieldId">;
  openExercisePicker: () => void;
  submit: () => void;
  listLayout: SharedValue<ListItemLayout[]>;
};

export default function SetGroupList({
  fields,
  methods,
  fieldArrayOps,
  openExercisePicker,
  submit,
  listLayout,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();
  const headerHeight = getSetGroupHeaderHeight(theme.spacing);

  const [reorderIndex, setReorderIndex] = useState(-1);

  // This is used to store the order of the list items
  // while they are being reordered
  const tightLayoutOrder = useSharedValue<number[]>([]);

  // This is used to compute and store the height of the entire list
  const height = useDerivedValue(() => {
    return listLayout.value.reduce((acc, item) => acc + item.relaxed.height, 0);
  });

  const setGroupFooterHeight = getSetGroupFooterHeight(theme.spacing);

  // This is used to update the order of the list items
  // every time a new item is added or removed
  useAnimatedReaction(
    () => listLayout.value,
    (layout, previousLayout) => {
      if (layout && previousLayout && layout.length !== previousLayout.length)
        tightLayoutOrder.value = layout.map((_, i) => i);
    }
  );

  useEffect(() => {
    // If the reorder index is not -1, then we are in the process of reordering
    // the items. Every set group has a relaxed and a tight layout. The tight
    // layout is used when the set group is being reordered. The tight layout
    // is a copy of the relaxed layout, but with a top value that is
    // calculated based on the top value of the reordered item and the
    // index of the item in the list.
    if (reorderIndex !== -1) {
      listLayout.value = listLayout.value.map((item, i) => {
        const referenceTop = listLayout.value[reorderIndex].relaxed.top;
        const top = referenceTop + (i - reorderIndex) * headerHeight;
        return setListLayoutValue(item, "tight", "top", top);
      });
    } else {
      // Reset the order of the tight list items so that
      // they are in the same order as the relaxed list items
      tightLayoutOrder.value = listLayout.value.map((_, i) => i);
    }
  }, [reorderIndex]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      // theme.spacing["12"] is used as a padding on the bottom
      // of the scroll view
      height: withTiming(height.value + setGroupFooterHeight),
    };
  });

  return (
    <View style={styles.form}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.scrollView, animatedStyles]}>
          {fields.map((setGroup, index) => (
            <SetGroup
              key={setGroup.fieldId}
              methods={methods}
              setGroup={setGroup}
              setGroupIndex={index}
              fieldArrayOps={fieldArrayOps}
              listLayout={listLayout}
              tightLayoutOrder={tightLayoutOrder}
              reorderIndex={reorderIndex}
              setReorderIndex={setReorderIndex}
            />
          ))}
          <SetGroupListFooter
            isReordering={reorderIndex !== -1}
            top={height}
            height={setGroupFooterHeight}
            openExercisePicker={openExercisePicker}
            submit={submit}
          />
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const useStyles = makeStyles(() => {
  return {
    form: {
      flex: 1,
      width: "100%",
    },
    scrollView: {
      position: "relative",
      width: "100%",
    },
  };
});
