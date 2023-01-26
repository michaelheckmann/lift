import Icon from "@expo/vector-icons/Ionicons";
import { makeStyles, useTheme } from "@rneui/themed";
import * as Haptics from "expo-haptics";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, Vibration, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { QuickMenuOptionType } from "src/component/Shared/QuickMenu";
import QuickMenuModal from "src/component/Shared/QuickMenuModal";
import { useTempStore } from "src/store";
import { formatCountdown } from "src/utils/functions/formatCountdown";
import useCountdown from "src/utils/hooks/useCountdown";

const DEFAULT_COUNTDOWN = 90; // seconds

type Props = {
  isCollapsed: boolean;
  handleFinish: (save?: boolean) => void;
  setExpanded: Dispatch<SetStateAction<boolean>>;
};

export default function WorkoutHeader({
  isCollapsed,
  handleFinish,
  setExpanded,
}: Props) {
  const styles = useStyles({ isCollapsed });
  const { theme } = useTheme();

  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);

  const timerButtonRef = useRef(null);
  const workoutButtonRef = useRef(null);

  const [timerMenuVisible, setTimerMenuVisible] = useState(false);
  const [workoutMenuVisible, setWorkoutMenuVisible] = useState(false);
  const { lastFinishedSet } = useTempStore();

  const [intervalValue, setIntervalValue] = useState(1000);
  const [countStart, setCountStart] = useState(DEFAULT_COUNTDOWN);
  const [
    count,
    { startCountdown, resetCountdown, incrementCountdown, decrementCountdown },
  ] = useCountdown({
    countStart,
    intervalMs: intervalValue,
  });

  useEffect(() => {
    if (count === 0) {
      Vibration.vibrate(200);
      resetCountdown();
    }
  }, [count]);

  useEffect(() => {
    if (lastFinishedSet) {
      resetCountdown();
      startCountdown();
    }
  }, [lastFinishedSet]);

  const openTimerMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    timerButtonRef.current.measureInWindow((x, y) => {
      xPosition.value = x;
      yPosition.value = y;
      setTimerMenuVisible(true);
    });
  };
  const closeTimerMenu = () => setTimerMenuVisible(false);
  const timerMenuOptions: QuickMenuOptionType[] = [
    {
      label: "- 30 seconds",
      icon: "remove-circle-outline",
      onPress: () => {
        decrementCountdown(30);
        closeTimerMenu();
      },
    },
    {
      label: "- 15 seconds",
      icon: "remove-circle-outline",
      onPress: () => {
        decrementCountdown(15);
        closeTimerMenu();
      },
    },
    {
      label: "+ 15 seconds",
      icon: "add-circle-outline",
      onPress: () => {
        incrementCountdown(15);
        closeTimerMenu();
      },
    },
    {
      label: "+ 30 seconds",
      icon: "add-circle-outline",
      onPress: () => {
        incrementCountdown(30);
        closeTimerMenu();
      },
    },
    {
      label: "Stop timer",
      icon: "stop-circle-outline",
      onPress: () => {
        resetCountdown();
        closeTimerMenu();
      },
    },
  ];

  const openWorkoutMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    workoutButtonRef.current.measureInWindow((x, y) => {
      xPosition.value = x;
      yPosition.value = y;
      setWorkoutMenuVisible(true);
    });
  };
  const closeWorkoutMenu = () => setWorkoutMenuVisible(false);
  const workoutMenuOptions: QuickMenuOptionType[] = [
    {
      label: "Add a note",
      icon: "document-text-outline",
      onPress: () => {
        console.log("Add a note");
        closeWorkoutMenu();
      },
    },
    {
      label: "Delete workout",
      icon: "trash-outline",
      onPress: () => {
        // TODO: Handle cascade delete
        // This is a bit tricky because we need to delete the workout,
        // the setGroups, and sets
        handleFinish(false);
        closeWorkoutMenu();
      },
    },
  ];

  return (
    <Animated.View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={isCollapsed ? 0.2 : 1}
        disabled={!isCollapsed}
        onPress={() => setExpanded((prev) => !prev)}
        style={{ height: "100%" }}
      >
        {/* Drag Affordance */}
        {!isCollapsed && (
          <View style={styles.dragAffordanceContainer}>
            <View style={styles.dragAffordance} />
          </View>
        )}

        {/* Header Bar */}
        {/* Timer Menu */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={openTimerMenu}
            ref={timerButtonRef}
            disabled={isCollapsed}
          >
            <Icon
              name="timer-outline"
              size={theme.spacing["6"]}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          {/* Countdown */}
          <TouchableOpacity
            style={styles.timeContainer}
            onPress={startCountdown}
            disabled={isCollapsed}
          >
            <Text style={styles.time}>{formatCountdown(count)}</Text>
          </TouchableOpacity>

          {/* Workout Menu */}
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={openWorkoutMenu}
            disabled={isCollapsed}
            ref={workoutButtonRef}
          >
            <Icon
              name="list-outline"
              size={theme.spacing["6"]}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Timer Menu */}
      <QuickMenuModal
        xPosition={xPosition}
        yPosition={yPosition}
        menuVisible={timerMenuVisible}
        setMenuVisible={setTimerMenuVisible}
        menuOptions={timerMenuOptions}
      />

      {/* Workout Menu */}
      <QuickMenuModal
        xPosition={xPosition}
        yPosition={yPosition}
        menuVisible={workoutMenuVisible}
        setMenuVisible={setWorkoutMenuVisible}
        menuOptions={workoutMenuOptions}
        openToLeft={true}
      />
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
