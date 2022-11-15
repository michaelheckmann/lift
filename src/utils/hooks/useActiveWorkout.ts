import { useBlockStore } from "src/store";

/**
 * It returns the id of the first workout that is not labelled "done"
 * @returns The id of the first workout that is not labbeled "done". If none exist, it returns undefined.
 */
export function useActiveWorkout(): string | undefined {
  const workouts = useBlockStore((state) => state.workouts);
  const openWorkout = workouts.find((workout) => !workout.done);
  return openWorkout?.id;
}
