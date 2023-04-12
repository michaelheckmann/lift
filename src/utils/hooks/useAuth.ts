import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "src/config/firebase";
import { setUserId } from "src/store/actions/operationsActions";

export type UseAuthReturnType = {
  user: User | null;
};

/**
 * It subscribes to the Firebase Auth state and updates the user state when the auth state changes
 * @returns An object with a user property.
 */
export function useAuth(): UseAuthReturnType {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubFromAuthStatusChanged = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // User is signed in
          // console.log(await user.getIdToken());
          setUserId(user.uid);
          setUser(user);
        } else {
          // User is signed out
          setUserId(undefined);
          setUser(undefined);
        }
      }
    );
    return unsubFromAuthStatusChanged;
  }, []);

  return {
    user,
  };
}
