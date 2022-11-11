import AuthStack from "navigation/authStack";
import UserStack from "navigation/userStack";
import React from "react";
import { useCustomTheme } from "src/utils/hooks/useCustomTheme";
import { useAuth } from "utils/hooks/useAuth";

export default function RootNavigation() {
  const { user } = useAuth();
  useCustomTheme();

  return user ? <UserStack /> : <AuthStack />;
}
