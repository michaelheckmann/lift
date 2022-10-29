import { Portal, PortalHost } from "@gorhom/portal";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { makeStyles } from "@rneui/themed";
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
import Workout from "./Workout";

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
  const tabBarHeight = useBottomTabBarHeight();
  const dimensions = useWindowDimensions();

  const top = useSharedValue(dimensions.height);
  const bottom = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.2);
  const borderRadius = useSharedValue(20);
  const borderWidth = useSharedValue(0);
  const backDropOpacity = useSharedValue(0);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, SPRING_CONFIG),
      bottom: withSpring(bottom.value, SPRING_CONFIG),
      shadowOpacity: withTiming(shadowOpacity.value, TIMING_CONFIG),
      borderTopLeftRadius: withTiming(borderRadius.value, TIMING_CONFIG),
      borderTopRightRadius: withTiming(borderRadius.value, TIMING_CONFIG),
      borderTopWidth: withTiming(borderWidth.value, TIMING_CONFIG),
      borderBottomWidth: withTiming(borderWidth.value, TIMING_CONFIG),
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
    borderRadius.value = 0;
    borderWidth.value = 1;
    backDropOpacity.value = withTiming(0, TIMING_CONFIG);
    setIsCollapsed(true);
  };

  const setExpanded = () => {
    top.value = WINDOW_HEIGHT - HEIGHT_EXPANDED;
    bottom.value = 0;
    shadowOpacity.value = 0.1;
    borderRadius.value = 20;
    borderWidth.value = 0;
    backDropOpacity.value = withTiming(0.2, TIMING_CONFIG);
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
            />
          </Animated.View>
        </PanGestureHandler>
      </Portal>
      <PortalHost name="custom_host" />
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    // bottom: 0,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.grey2,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowRadius: 8,
    elevation: 5,
    padding: 20,
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
