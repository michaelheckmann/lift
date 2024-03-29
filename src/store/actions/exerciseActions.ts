import update from "immutability-helper";
import { useLiftStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { ExerciseCreate, ExerciseSlice } from "src/utils/types/Exercise";
import { Action } from "src/utils/types/lib/Actions";
import { dispatchAction } from "../utils";

type CreateExerciseDispatchArgs = {
  name: string;
};

// Actions
export const createExercise: Action<
  ExerciseCreate,
  CreateExerciseDispatchArgs
> = {
  dispatch(args) {
    const exercise: ExerciseCreate = {
      id: generateUUID("xrc"),
      user_id: useLiftStore.getState().operations.global.userId,
      ...args,
    };
    dispatchAction<ExerciseCreate>(createExercise, exercise);
    return exercise.id;
  },
  _commit(args) {
    return updateRemoteState<ExerciseCreate>("exercises", "POST", args);
  },
  _store({ id, name }) {
    const newExercise: ExerciseSlice = {
      id,
      name,
      archived: false,
    };
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        exercises: {
          $push: [newExercise],
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useLiftStore
      .getState()
      .exercises.findIndex((exercise) => exercise.id === id);
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        exercises: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};
