import { Button, makeStyles } from "@rneui/themed";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type Props = {
  isReordering: boolean;
  top: SharedValue<number>;
  height: number;
  openExercisePicker: () => void;
  submit: () => void;
};

export default function SetGroupListFooter({
  isReordering,
  top,
  height,
  openExercisePicker,
  submit,
}: Props) {
  const styles = useStyles();
  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isReordering ? 0 : 1),
    };
  });
  // While we're reording, we want to hide the spacer content
  const spacerStyleBottom = useAnimatedStyle(() => {
    return {
      top: withTiming(top.value),
      height: withTiming(isReordering ? 0 : height),
    };
  });

  return (
    <Animated.View style={[styles.spacer, spacerStyleBottom]}>
      <Animated.View style={opacityStyle}>
        <Button
          title="Add Exercise"
          buttonStyle={styles.addSetGroupButton}
          titleStyle={styles.addSetGroupButtonText}
          onPress={openExercisePicker}
        />
        <Button
          title="Finish Workout"
          buttonStyle={styles.finishWorkoutButton}
          titleStyle={styles.finishWorkoutButtonText}
          onPress={submit}
        />
      </Animated.View>
    </Animated.View>
  );
}

const useStyles = makeStyles((theme) => {
  const { colors, spacing, mode } = theme;
  return {
    spacer: {
      width: "100%",
      overflow: "hidden",
    },
    addSetGroupButton: {
      backgroundColor: colors.background,
      borderColor: colors.text,
      height: spacing["12"],
      marginBottom: spacing["4"],
    },
    addSetGroupButtonText: {
      color: colors.text,
    },
    finishWorkoutButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      height: spacing["12"],
      marginBottom: spacing["4"],
    },
    finishWorkoutButtonText: {
      color: mode === "dark" ? colors.primary900 : colors.primary50,
    },
  };
});
