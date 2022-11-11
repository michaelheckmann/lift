import { useBlockStore } from "src/store";

export function useActiveWorkout(): string | undefined {
  const workouts = useBlockStore((state) => state.workouts);
  const openWorkout = workouts.find((workout) => !workout.done);
  return openWorkout?.id;
}
