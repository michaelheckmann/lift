import { StoreType } from "src/store";
import { exercisesState } from "./slices/exercisesSlice";
import { operationsState } from "./slices/operationsSlice";
import { setGroupsState } from "./slices/setgroupsSlice";
import { setsState } from "./slices/setsSlice";
import { settingsState } from "./slices/settingsSlice";
import { workoutsState } from "./slices/workoutsSlice";

export const defaultMockStore: StoreType = {
  settings: settingsState,
  operations: operationsState,
  exercises: exercisesState,
  setGroups: [
    ...setGroupsState,
    {
      id: "stg1",
      archived: false,
      exercise_id: exercisesState[0].id, // Bench Press
      workout_id: "wrk1",
      order: 1,
    },
  ],
  sets: [
    ...setsState,
    {
      id: "set1",
      archived: false,
      setgroup_id: "stg1",
      reps: 10,
      weight: 100,
      done: true,
    },
  ],
  workouts: [
    ...workoutsState,
    {
      id: "wrk1",
      archived: false,
      created_at: new Date("2022-11-13"),
      done: false,
    },
  ],
};

export const emptyMockStore: StoreType = {
  settings: settingsState,
  operations: operationsState,
  exercises: exercisesState,
  setGroups: [],
  sets: [],
  workouts: [],
};
