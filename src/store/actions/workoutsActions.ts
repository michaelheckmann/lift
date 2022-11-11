import update from "immutability-helper";
import { useBlockStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { WorkoutCreate } from "src/utils/types/Workout";
import { Overwrite } from "../../utils/types/lib/Overwrite";
import { Action, dispatchAction } from "../utils";

type CreateWorkoutType = Overwrite<
  Action<WorkoutCreate>,
  {
    dispatch: () => string;
  }
>;

// Actions
export const createWorkout: CreateWorkoutType = {
  dispatch() {
    const id = generateUUID("wrk");
    const user_id = useBlockStore.getState().operations.global.userId;
    dispatchAction(createWorkout, { id, user_id });
    return id;
  },
  _commit({ id, user_id }) {
    return updateRemoteState<WorkoutCreate>("workouts", "POST", {
      id,
      user_id,
    });
  },
  _store({ id }) {
    const newWorkout = {
      id,
      done: false,
      archived: false,
      created_at: new Date(),
    };

    useBlockStore.setState(
      update(useBlockStore.getState(), {
        workouts: {
          $push: [newWorkout],
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useBlockStore
      .getState()
      .workouts.findIndex((workout) => workout.id === id);
    useBlockStore.setState(
      update(useBlockStore.getState(), {
        workouts: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};
