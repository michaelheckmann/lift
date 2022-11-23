import update from "immutability-helper";
import { useBlockStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { Action } from "src/utils/types/lib/Actions";
import { SetGroupCreate, SetGroupSlice } from "src/utils/types/SetGroup";
import { dispatchAction } from "../utils";

type CreateSetGroupDispatchArgs = {
  workout_id: string;
  order: number;
  exercise_id: string;
};

// Actions
export const createSetGroup: Action<
  SetGroupCreate,
  CreateSetGroupDispatchArgs
> = {
  dispatch(args) {
    const setGroup: SetGroupCreate = {
      id: generateUUID("stg"),
      ...args,
    };
    dispatchAction<SetGroupCreate>(createSetGroup, setGroup);
    return setGroup.id;
  },
  _commit(args) {
    return updateRemoteState<SetGroupCreate>("setgroups", "POST", args);
  },
  _store({ id, workout_id, exercise_id, order }) {
    const newSetGroup: SetGroupSlice = {
      id,
      exercise_id,
      order,
      workout_id,
      archived: false,
    };
    useBlockStore.setState(
      update(useBlockStore.getState(), {
        setGroups: {
          $push: [newSetGroup],
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useBlockStore
      .getState()
      .setGroups.findIndex((setGroup) => setGroup.id === id);
    useBlockStore.setState(
      update(useBlockStore.getState(), {
        setGroups: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};
