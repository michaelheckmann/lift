import AuthStack from "navigation/authStack";
import UserStack from "navigation/userStack";
import React from "react";
import { useAuth } from "utils/hooks/useAuth";

export default function RootNavigation() {
  const { user } = useAuth();

  return user ? <UserStack /> : <AuthStack />;
}
