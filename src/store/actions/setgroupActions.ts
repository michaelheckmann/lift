import update from "immutability-helper";
import { useBlockStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { SetGroupCreate, SetGroupSlice } from "src/utils/types/SetGroup";
import { Overwrite } from "../../utils/types/lib/Overwrite";
import { Action, dispatchAction } from "../utils";

type SetGroupDispatchArgs = {
  workout_id: string;
  order: number;
  exercise_id: string;
};

type CreateSetGroupType = Overwrite<
  Action<SetGroupCreate>,
  {
    dispatch: (setGroupDispatchArgs: SetGroupDispatchArgs) => string;
  }
>;

// Actions
export const createSetGroup: CreateSetGroupType = {
  dispatch({ workout_id, order, exercise_id }) {
    const id = generateUUID("stg");
    dispatchAction<SetGroupCreate, any>(createSetGroup, {
      id,
      workout_id,
      exercise_id,
      order,
    });
    return id;
  },
  _commit({ id, workout_id, exercise_id, order }) {
    return updateRemoteState<SetGroupCreate>("setgroups", "POST", {
      id,
      workout_id,
      exercise_id,
      order,
    });
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
