import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { collections } from "src/utils/functions/firestore";
import { useCustomTheme } from "utils/hooks/useCustomTheme";
import { defaultProfile, Profile } from "utils/types/Profile";

const auth = getAuth();

export function useAuth() {
  const [user, setUser] = useState<User>();
  const [profile, setProfile] = useState<Profile>();
  const setCustomTheme = useCustomTheme();

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      }
    );

    return unsubscribeFromAuthStatuChanged;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Load the profile data
    const ref = doc(collections.profiles, user.uid);

    const unsub = onSnapshot(ref, (profileSnap) => {
      console.log(profileSnap.metadata);
      console.log(profileSnap.data());
      let profileData = defaultProfile;
      if (profileSnap.exists()) {
        console.log("profileSnap.exists");
        profileData = profileSnap.data() as Profile;
      } else {
        console.log("else");
        // setDoc(ref, defaultProfile);
      }
      setProfile(profileData);
      setCustomTheme(profileData);
    });

    return unsub;
  }, [user]);

  return {
    user,
    profile,
  };
}
