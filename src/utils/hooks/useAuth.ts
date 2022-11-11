import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "src/config/firebase";
import { setUserId } from "src/store/actions/operationsActions";

export function useAuth() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // User is signed in
          setUserId(user.uid);
          setUser(user);
        } else {
          // User is signed out
          setUserId(undefined);
          setUser(undefined);
        }
      }
    );
    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user,
  };
}
