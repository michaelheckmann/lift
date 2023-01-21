import { useLiftStore } from "src/store";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

// These functions are used to fetch complex data from the local store.

/**
 * It takes a workout id, and returns a workout object with all the set groups, sets, and exercises
 * that belong to it
 * @param {string} id - string - The id of the workout you want to get
 * @returns An object with the workout, setGroups, sets, and exercises.
 */
export function getWorkoutbyId(id: string): WorkoutJoin {
  // Get the state of the store
  const { workouts, setGroups, sets, exercises } = useLiftStore.getState();
  // Find the workout with the provided id
  const workout = workouts.find((workout) => {
    return workout.id === id;
  });
  // Filter the setGroups to only include those that are part of the selected workout
  const relevantSetGroups = setGroups.filter(
    (setGroup) => !setGroup.archived && setGroup.workout_id === id
  );
  // Filter the sets to only include those that are part of the selected workout
  const relevantSets = sets.filter(
    (set) =>
      !set.archived &&
      relevantSetGroups.some((setGroup) => setGroup.id === set.setgroup_id)
  );
  // Filter the exercises to only include those that are part of the selected workout
  const relevantExercises = exercises.filter((exercise) =>
    relevantSetGroups.some((setGroup) => setGroup.exercise_id === exercise.id)
  );

  // If the workout doesn't exist, throw an error
  if (!workout) {
    throw new Error(`Workout with id ${id} not found`);
  }

  // Return the workout with the setGroups, sets, and exercises
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
