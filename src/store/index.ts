import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseSlice } from "src/utils/types/Exercise";
import { SetSlice } from "src/utils/types/Set";
import { SetGroupSlice } from "src/utils/types/SetGroup";
import { SettingSlice } from "src/utils/types/Settings";
import { WorkoutSlice } from "src/utils/types/Workout";
import create from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
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

export const useBlockStore = create<StoreType>()(
  // logger(
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
        name: "block-storage",
        getStorage: () => AsyncStorage,
      }
    )
  )
  // )
);

export const resetState = () => {
  useBlockStore.setState({
    settings: settingsState,
    operations: operationsState,
    exercises: exercisesState,
    setGroups: setGroupsState,
    sets: setsState,
    workouts: workoutsState,
  });
};
