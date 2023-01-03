import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseSlice } from "src/utils/types/Exercise";
import { SetSlice } from "src/utils/types/Set";
import { SetGroupSlice } from "src/utils/types/SetGroup";
import { SettingSlice } from "src/utils/types/Settings";
import { WorkoutSlice } from "src/utils/types/Workout";
import create from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { logger } from "./middleware";
import { exercisesState } from "./slices/exercisesSlice";
import { OperationSlice, operationsState } from "./slices/operationsSlice";
import { setGroupsState } from "./slices/setgroupsSlice";
import { setsState } from "./slices/setsSlice";
import { settingsState } from "./slices/settingsSlice";
import { workoutsState } from "./slices/workoutsSlice";

export interface StoreType {
  settings: SettingSlice;
  operations: OperationSlice;
  exercises: ExerciseSlice[];
  setGroups: SetGroupSlice[];
  sets: SetSlice[];
  workouts: WorkoutSlice[];
}

export const useLiftStore = create<StoreType>()(
  logger(
    // subscribeWithSelector is necessary for sub function in useCustomTheme
    // https://docs.pmnd.rs/zustand/recipes/recipes#reading/writing-state-and-reacting-to-changes-outside-of-components
    subscribeWithSelector(
      persist(
        () => ({
          settings: settingsState,
          operations: operationsState,
          exercises: exercisesState,
          setGroups: setGroupsState,
          sets: setsState,
          workouts: workoutsState,
        }),
        {
          name: "lift-storage",
          getStorage: () => AsyncStorage,
        }
      )
    )
  )
);

/**
 * It resets the state of the lift store to the default state
 */
export const resetState = () => {
  useLiftStore.setState({
    settings: settingsState,
    operations: operationsState,
    exercises: exercisesState,
    setGroups: setGroupsState,
    sets: setsState,
    workouts: workoutsState,
  });
};
