import update from "immutability-helper";
import { useBlockStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { SetCreate, SetSlice } from "src/utils/types/Set";
import { Overwrite } from "../../utils/types/lib/Overwrite";
import { Action, dispatchAction } from "../utils";

type SetDispatchArgs = {
  setgroup_id: string;
};

type CreateSetType = Overwrite<
  Action<SetCreate>,
  {
    dispatch: (setDispatchArgs: SetDispatchArgs) => string;
  }
>;

// Actions
export const createSet: CreateSetType = {
  dispatch({ setgroup_id }) {
    const id = generateUUID("set");
    const reps = 0;
    const weight = 0;
    dispatchAction<SetCreate, any>(createSet, {
      id,
      setgroup_id,
      reps,
      weight,
    });
    return id;
  },
  _commit({ id, setgroup_id, reps, weight }) {
    return updateRemoteState<SetCreate>("sets", "POST", {
      id,
      setgroup_id,
      reps,
      weight,
    });
  },
  _store({ id, setgroup_id, reps, weight }) {
    const newSet: SetSlice = {
      id,
      setgroup_id,
      reps,
      weight,
      done: false,
      archived: false,
    };

    useBlockStore.setState(
      update(useBlockStore.getState(), {
        sets: {
          $push: [newSet],
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useBlockStore
      .getState()
      .sets.findIndex((set) => set.id === id);
    useBlockStore.setState(
      update(useBlockStore.getState(), {
        sets: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};
