import update from "immutability-helper";
import { useLiftStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { Action } from "src/utils/types/lib/Actions";
import { SetCreate, SetSlice, SetUpdate } from "src/utils/types/Set";
import { dispatchAction } from "../utils";

type CreateSetDispatchArgs = {
  setgroup_id: string;
};

export const createSet: Action<SetCreate, CreateSetDispatchArgs> = {
  dispatch(args) {
    const set: SetCreate = {
      id: generateUUID("set"),
      reps: 0,
      weight: 0,
      ...args,
    };
    dispatchAction<SetCreate>(createSet, set);
    return set.id;
  },
  _commit(args) {
    return updateRemoteState<SetCreate>("sets", "POST", args);
  },
  _store({ id, reps, weight, setgroup_id }) {
    const newSet: SetSlice = {
      id,
      reps,
      weight,
      setgroup_id,
      done: false,
      archived: false,
    };
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        sets: {
          $push: [newSet],
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useLiftStore
      .getState()
      .sets.findIndex((set) => set.id === id);
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        sets: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};

export const updateSet: Action<SetUpdate> = {
  dispatch(args) {
    dispatchAction<SetUpdate>(updateSet, args);
  },
  _commit({ id, ...args }) {
    return updateRemoteState<SetUpdate>(`sets?id=eq.${id}`, "PATCH", args);
  },
  _store(args) {
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        sets: {
          $apply: (sets: SetSlice[]) =>
            sets.map((set) => {
              if (set.id === args.id) {
                return {
                  ...set,
                  ...args,
                };
              }
              return set;
            }),
        },
      })
    );
  },
  _rollback({ id }, previousState) {
    const previous = previousState.sets.find((set) => set.id === id);
    if (!previous) {
      return;
    }
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        sets: {
          $apply: (sets: SetSlice[]) =>
            sets.map((set) => {
              if (set.id === id) {
                return {
                  ...set,
                  ...previous,
                };
              }
              return set;
            }),
        },
      })
    );
  },
};
