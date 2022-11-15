import { useBlockStore } from "src/store";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

// These functions are used to fetch complex data from the local store.

/**
 * It takes a workout id, and returns a workout object with all the set groups, sets, and exercises
 * that belong to it
 * @param {string} id - string - The id of the workout you want to get
 * @returns An object with the workout, setGroups, sets, and exercises.
 */
export function getWorkoutbyId(id: string): WorkoutJoin {
  const { workouts, setGroups, sets, exercises } = useBlockStore.getState();
  const workout = workouts.find((workout) => {
    return workout.id === id;
  });
  const relevantSetGroups = setGroups.filter(
    (setGroup) => setGroup.workout_id === id
  );
  const relevantSets = sets.filter((set) =>
    relevantSetGroups.some((setGroup) => setGroup.id === set.setgroup_id)
  );
  const relevantExercises = exercises.filter((exercise) =>
    relevantSetGroups.some((setGroup) => setGroup.exercise_id === exercise.id)
  );

  if (!workout) {
    throw new Error(`Workout with id ${id} not found`);
  }

  return {
    ...workout,
    setGroups: relevantSetGroups.map((setGroup) => ({
      ...setGroup,
      sets: relevantSets.filter((set) => set.setgroup_id === setGroup.id),
      exercise: relevantExercises.find(
        (exercise) => exercise.id === setGroup.exercise_id
      ),
    })),
  };
}
