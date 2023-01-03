import Icon from "@expo/vector-icons/Ionicons";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import React from "react";
import { View } from "react-native";

import ProfileScreen from "src/screens/ProfileScreen";
import SearchScreen from "src/screens/SearchScreen";
import WorkoutScreen from "src/screens/WorkoutScreen";
import { StoreType, useLiftStore } from "src/store";
import { useShadow } from "src/utils/hooks/useShadow";

const Tab = createBottomTabNavigator();
const selector = (state: StoreType) =>
  state.operations.global.workoutSheetCollapsed;

// This is necessary to align the background color
// of the tab bar with the background color of the
// screen. Otherwise, the tab bar will have a white
// background.
const CustomTabBar = (props) => {
  return (
    <View
      style={{
        backgroundColor: props.theme.colors.background,
      }}
    >
      <BottomTabBar {...props} />
    </View>
  );
};

export default function UserStack() {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;
  const shadow = useShadow();

  const workoutSheetCollapsed = useLiftStore(selector);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Workout"
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        tabBar={(props) => <CustomTabBar {...props} theme={theme} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            backgroundColor: colors.foreground,
            borderTopColor: colors.border,
            borderColor: colors.border,
            borderTopWidth: spacing["0.5"],
            borderWidth: spacing["0.5"],
            height: spacing["16"],
            marginLeft: spacing["5"],
            marginRight: spacing["5"],
            borderRadius: borderRadius.md,
            borderTopRightRadius: workoutSheetCollapsed ? 0 : borderRadius.md,
            borderTopLeftRadius: workoutSheetCollapsed ? 0 : borderRadius.md,
            paddingBottom: spacing["0"],
            marginBottom: spacing["10"],
            ...shadow,
          },
          tabBarItemStyle: {},
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="person" color={color} size={spacing["6"]} />
            ),
          }}
        />
        <Tab.Screen
          name="Workout"
          component={WorkoutScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="barbell-sharp" color={color} size={spacing["6"]} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="search" color={color} size={spacing["6"]} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
