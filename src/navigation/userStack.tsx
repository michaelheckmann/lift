import Icon from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import React from "react";

import HomeScreen from "screens/HomeScreen";
import SettingsScreen from "src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  const { theme } = useTheme();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          tabBarIconStyle: {
            fontSize: 10,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={18} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="settings" color={color} size={18} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
