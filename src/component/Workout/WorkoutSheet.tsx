import { Portal } from "@gorhom/portal";
import { makeStyles, useTheme } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Dimensions, useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { setWorkoutSheetCollapsed } from "src/store/actions/operationsActions";
import Workout from "./Workout/Workout";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const HEIGHT_COLLAPSED = 200; // ~600
const HEIGHT_EXPANDED = WINDOW_HEIGHT * 0.95; // ~40
const THRESHOLD = 50;

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

const TIMING_CONFIG = {
  duration: 200,
};

export default function WorkoutSheet({ isOpen, onClose, workoutData }) {
  const styles = useStyles();
  const dimensions = useWindowDimensions();
  const { theme } = useTheme();
  // theme.spacing["10"] = Tab.Navigator margin bottom
  // theme.spacing["16"] = Tab.Navigator height
  const tabBarHeight = theme.spacing["10"] + theme.spacing["16"];

  const top = useSharedValue(dimensions.height);
  const bottom = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.2);
  const borderRadius = useSharedValue(theme.borderRadius.md);
  const borderWidth = useSharedValue(0);
  const backDropOpacity = useSharedValue(0);
  const margin = useSharedValue(0);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [moveStarted, setMoveStarted] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG),
      bottom: withSpring(bottom.value, SPRING_CONFIG),
      shadowOpacity: withTiming(shadowOpacity.value, TIMING_CONFIG),
      borderTopLeftRadius: withTiming(borderRadius.value, TIMING_CONFIG),
      borderTopRightRadius: withTiming(borderRadius.value, TIMING_CONFIG),
      borderTopWidth: withTiming(borderWidth.value, TIMING_CONFIG),
      borderRightWidth: withTiming(borderWidth.value, TIMING_CONFIG),
      borderLeftWidth: withTiming(borderWidth.value, TIMING_CONFIG),
      marginRight: withTiming(margin.value, TIMING_CONFIG),
      marginLeft: withTiming(margin.value, TIMING_CONFIG),
    };
  });

  const backDropAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backDropOpacity.value,
        [0, 1],
        ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]
      ),
    };
  });

  const setCollapsed = () => {
    top.value = WINDOW_HEIGHT - HEIGHT_COLLAPSED;
    bottom.value = tabBarHeight;
    shadowOpacity.value = 0;
    borderRadius.value = theme.borderRadius.md;
    borderWidth.value = theme.spacing["0.5"];
    backDropOpacity.value = withTiming(0, TIMING_CONFIG);
    margin.value = theme.spacing["5"];
    setIsCollapsed(true);
  };

  const setExpanded = () => {
    top.value = WINDOW_HEIGHT - HEIGHT_EXPANDED;
    bottom.value = 0;
    shadowOpacity.value = 0.1;
    borderRadius.value = theme.borderRadius.md;
    borderWidth.value = 0;
    backDropOpacity.value = withTiming(0.2, TIMING_CONFIG);
    margin.value = 0;
    setIsCollapsed(false);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context: any) {
      context.startTop = top.value;
    },
    onActive(event, context) {
      // Math.min prevents the sheet from
      // shrinking in collapsed state
      top.value = Math.min(
        context.startTop + event.translationY,
        WINDOW_HEIGHT - HEIGHT_COLLAPSED
      );

      // This is necessary, else this would get triggered
      // on scroll
      if (Math.abs(event.translationY) > 10 && !moveStarted) {
        runOnJS(setMoveStarted)(true);
      }
    },
    onEnd() {
      // (WINDOW_HEIGHT - top.value) is the distance from the bottom
      // of the screen to the point where the user released the touch
      if (isCollapsed) {
        if (WINDOW_HEIGHT - top.value > HEIGHT_COLLAPSED + THRESHOLD) {
          // Change to expanded view
          runOnJS(setExpanded)();
        } else {
          // Stay with collapsed view
          top.value = WINDOW_HEIGHT - HEIGHT_COLLAPSED;
        }
      } else {
        if (WINDOW_HEIGHT - top.value < HEIGHT_EXPANDED - THRESHOLD) {
          // Change to collapsed view
          runOnJS(setCollapsed)();
        } else {
          // Stay with expanded view
          top.value = WINDOW_HEIGHT - HEIGHT_EXPANDED;
        }
      }
      runOnJS(setMoveStarted)(false);
    },
  });

  useEffect(() => {
    if (isOpen) {
      setExpanded();
    } else {
      top.value = withSpring(
        dimensions.height, // Fully invisible
        SPRING_CONFIG
      );
      backDropOpacity.value = withTiming(0, TIMING_CONFIG);
    }
    // This is stored in the ZUSTAND store
    // so that TAB NAVIGATOR can access it
    setWorkoutSheetCollapsed(isOpen);
  }, [isOpen]);

  return (
    <>
      <Portal>
        {/* Backdrop */}
        <Animated.View
          pointerEvents="none"
          style={[styles.backDrop, backDropAnimatedStyle]}
        ></Animated.View>

        {/* Modal */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <Workout
              onClose={onClose}
              workoutData={workoutData}
              isCollapsed={isCollapsed}
              setExpanded={setExpanded}
              moveStarted={moveStarted}
            />
          </Animated.View>
        </PanGestureHandler>
      </Portal>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowRadius: 8,
    elevation: 5,
    padding: spacing["2.5"],
    justifyContent: "center",
    alignItems: "center",
  },
  backDrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
}));
