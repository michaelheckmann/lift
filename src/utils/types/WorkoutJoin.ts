import { SetGroupSlice } from "src/utils/types/SetGroup";
import { WorkoutSlice } from "src/utils/types/Workout";
import { ExerciseSlice } from "./Exercise";
import { SetSlice } from "./Set";

type SetGroupJoin = SetGroupSlice & {
  sets: SetSlice[];
  exercise: ExerciseSlice;
};

export type WorkoutJoin = WorkoutSlice & {
  setGroups: SetGroupJoin[];
};
