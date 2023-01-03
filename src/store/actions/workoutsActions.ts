import update from "immutability-helper";
import { useLiftStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { Action } from "src/utils/types/lib/Actions";
import { Overwrite } from "src/utils/types/lib/Overwrite";
import {
  WorkoutCreate,
  WorkoutSlice,
  WorkoutUpdate,
} from "src/utils/types/Workout";
import { dispatchAction } from "../utils";

type CreateWorkoutType = Overwrite<
  Action<WorkoutCreate>,
  {
    dispatch(): string;
  }
>;

// Actions
export const createWorkout: CreateWorkoutType = {
  dispatch() {
    const workout: WorkoutCreate = {
      id: generateUUID("wrk"),
      user_id: useLiftStore.getState().operations.global.userId,
    };
    dispatchAction(createWorkout, workout);
    return workout.id;
  },
  _commit(args) {
    return updateRemoteState<WorkoutCreate>("workouts", "POST", args);
  },
  _store({ id }) {
    const newWorkout: WorkoutSlice = {
      id,
      done: false,
      archived: false,
      created_at: new Date(),
    };
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        workouts: {
          $push: [newWorkout],
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useLiftStore
      .getState()
      .workouts.findIndex((workout) => workout.id === id);
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        workouts: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};

export const updateWorkout: Action<WorkoutUpdate> = {
  dispatch(args) {
    dispatchAction<WorkoutUpdate>(updateWorkout, args);
  },
  _commit({ id, ...args }) {
    return updateRemoteState<WorkoutUpdate>(
      `workouts?id=eq.${id}`,
      "PATCH",
      args
    );
  },
  _store(args) {
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        workouts: {
          $apply: (workouts: WorkoutSlice[]) =>
            workouts.map((workout) => {
              if (workout.id === args.id) {
                return {
                  ...workout,
                  ...args,
                };
              }
              return workout;
            }),
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useLiftStore
      .getState()
      .workouts.findIndex((workout) => workout.id === id);
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        workouts: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};
