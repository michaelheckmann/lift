import { useBlockStore } from "src/store";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";

export function getWorkoutbyId(id: string): WorkoutJoin {
  const { workouts, setGroups, sets, exercises } = useBlockStore.getState();
  const workout = workouts.find((workout) => workout.id === id);
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
