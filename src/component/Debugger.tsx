import Icon from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { resetState, StoreType, useBlockStore } from "src/store";
import {
  toggleOnlineState,
  toggleOnlineTesting,
} from "src/store/actions/operationsActions";

const selector = (state) => state.operations;

export default function Debugger() {
  const [isOpen, setIsOpen] = useState(false);
  const operations: StoreType["operations"] = useBlockStore(selector);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.translateX + event.translationX;
      translateY.value = context.translateY + event.translationY;
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          styles.fab,
          animatedStyle,
          {
            borderRadius: isOpen ? 30 : 50,
          },
        ]}
      >
        {/* Debug Container */}
        {isOpen && (
          <View style={styles.debugContainer}>
            <View style={styles.row}>
              {/* ONLINE ENABLED */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>TESTING: ONLINE</Text>
                <Switch
                  trackColor={{ false: "#3e3e3e", true: "#81b0ff" }}
                  ios_backgroundColor="#3e3e3e"
                  value={operations.config.testing.isOnline.enabled}
                  onValueChange={toggleOnlineTesting}
                />
              </View>

              {/* ONLINE VALUE */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>
                  {operations.config.testing.isOnline.value
                    ? "ONLINE"
                    : "OFFLINE"}
                </Text>
                <Switch
                  trackColor={{ false: "#3e3e3e", true: "#81b0ff" }}
                  ios_backgroundColor="#3e3e3e"
                  value={operations.config.testing.isOnline.value}
                  onValueChange={toggleOnlineState}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.toggleContainer}>
                <TouchableOpacity onPress={resetState} style={styles.button}>
                  <Text style={styles.buttonLabel}>Reset State</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Fab Icon */}
        <TouchableOpacity onPress={() => setIsOpen((o) => !o)}>
          <Icon name="code" color="white" size={30} />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "black",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 16.84,
    elevation: 5,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "white",
  },
  row: {
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    width: "100%",
    borderColor: "white",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleLabel: {
    color: "white",
    letterSpacing: 1.1,
    marginRight: 10,
  },
  debugContainer: {
    width: 300,
    height: 300,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonLabel: {
    color: "black",
    letterSpacing: 1.1,
    fontWeight: "bold",
  },
});
