import Icon from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import React from "react";

import ProfileScreen from "src/screens/ProfileScreen";
import SearchScreen from "src/screens/SearchScreen";
import WorkoutScreen from "src/screens/WorkoutScreen";
import { useShadow } from "src/utils/hooks/useShadow";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;
  const shadow = useShadow();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Workout"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary900,
          tabBarStyle: {
            borderTopColor: colors.primary900,
            borderColor: colors.primary900,
            borderTopWidth: spacing["0.5"],
            borderWidth: spacing["0.5"],
            height: spacing["16"],
            marginLeft: spacing["5"],
            marginRight: spacing["5"],
            borderRadius: borderRadius.md,
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
