import { makeStyles, useTheme } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayMove,
  UseFormReturn,
} from "react-hook-form";
import { View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  getSetGroupContentHeight,
  getSetGroupFooterHeight,
} from "src/utils/functions/getSetGroupHeights";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
import SetGroup, { listAnimationConfig } from "../SetGroup/SetGroup";
import SetGroupListFooter from "./SetGroupListFooter";

type Props = {
  fields: FieldArrayWithId<WorkoutJoin, "setGroups", "fieldId">[];
  methods: UseFormReturn<WorkoutJoin, any>;
  move: UseFieldArrayMove;
  openExercisePicker: () => void;
  submit: () => void;
};

export default function SetGroupList({
  fields,
  methods,
  move,
  openExercisePicker,
  submit,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();

  const [reorderingItem, setReorderingItem] = useState(-1);

  const defaultHeight = {
    // Nothing is rendered by default in the header
    top: 0,
    // The footer has a fixed height
    bottom: getSetGroupFooterHeight(theme.spacing),
  };

  const spacerTopHeight = useSharedValue(defaultHeight.top);
  const spacerBottomHeight = useSharedValue(defaultHeight.bottom);

  // This code is used to calculate the height of each set group
  // when the user is reordering them. This is used to add a spacer
  // before the first and after the last list item. This is necessary
  // to prevent the list from jumping when the user drags an item
  useEffect(() => {
    if (reorderingItem !== -1) {
      let top = 0;
      let bottom = 0;

      methods.getValues().setGroups.forEach((setGroup, index) => {
        if (index < reorderingItem) {
          top += getSetGroupContentHeight(theme.spacing, setGroup.sets.length);
        } else {
          bottom += getSetGroupContentHeight(
            theme.spacing,
            setGroup.sets.length
          );
        }
      });
      console.log("top", top + defaultHeight.top);
      console.log("bottom", bottom + defaultHeight.bottom);
      spacerTopHeight.value = top + defaultHeight.top;
      spacerBottomHeight.value = bottom + defaultHeight.bottom;
    } else {
      spacerTopHeight.value = defaultHeight.top;
      spacerBottomHeight.value = defaultHeight.bottom;
    }
  }, [reorderingItem]);

  const handleDragEnd = ({ from, to }) => {
    move(from, to);
    setReorderingItem(-1);
  };

  const renderItem = useCallback(
    (
      renderItemProps: RenderItemParams<
        FieldArrayWithId<WorkoutJoin, "setGroups", "fieldId">
      >
    ) => (
      <SetGroup
        key={renderItemProps.item.fieldId}
        renderItemProps={renderItemProps}
        methods={methods}
        reorderingItem={reorderingItem}
        setReorderingItem={setReorderingItem}
      />
    ),
    [reorderingItem, setReorderingItem]
  );

  const spacerStyleTop = useAnimatedStyle(() => {
    return {
      height: withTiming(spacerTopHeight.value, listAnimationConfig),
    };
  });

  const renderSpacerTop = useCallback(() => {
    return <Animated.View style={[styles.spacer, spacerStyleTop]} />;
  }, [spacerStyleTop]);

  const renderSpacerBottom = useCallback(() => {
    return (
      <SetGroupListFooter
        isReordering={reorderingItem !== -1}
        height={spacerBottomHeight}
        {...{ openExercisePicker, submit }}
      />
    );
  }, [reorderingItem, spacerBottomHeight]);

  return (
    <View style={styles.form}>
      <DraggableFlatList
        data={fields}
        keyExtractor={({ fieldId }) => fieldId}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={400}
        containerStyle={{ flex: 1 }}
        onDragEnd={handleDragEnd}
        renderItem={renderItem}
        ListHeaderComponent={renderSpacerTop}
        ListFooterComponent={renderSpacerBottom}
      />
    </View>
  );
}

const useStyles = makeStyles(() => {
  return {
    form: {
      flex: 1,
      width: "100%",
    },
    spacer: {
      width: "100%",
      backgroundColor: "#FAFAD2",
    },
  };
});
