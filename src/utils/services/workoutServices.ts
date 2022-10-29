import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "utils/hooks/useAuth";
import { Workout } from "utils/types/Workout";
import { collections } from "../functions/firestore";

export function useWorkoutQuery() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      query(collections.workouts, where("user_id", "==", user.uid)),
      (workoutSnap) => {
        const workoutsData = workoutSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workout[];

        setWorkouts(workoutsData);
      }
    );

    return unsub;
  }, [user]);

  return {
    workouts,
  };
}
