import Icon from "@expo/vector-icons/MaterialIcons";
import {
  disableNetwork,
  enableNetwork,
  getFirestore,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const db = getFirestore();

export default function Debugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (isOnline) {
      (async () => {
        try {
          await enableNetwork(db);
        } catch (error) {
          setIsOnline(false);
        }
      })();
    } else {
      (async () => {
        try {
          await disableNetwork(db);
        } catch (error) {
          setIsOnline(true);
        }
      })();
    }
  }, [isOnline]);

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
      <Animated.View style={[styles.fab, animatedStyle]}>
        {isOpen && (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Text>
            <Switch value={isOnline} onValueChange={setIsOnline} />
          </View>
        )}
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
  offlineContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  offlineText: {
    marginRight: 10,
  },
});
