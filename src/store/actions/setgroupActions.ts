import update from "immutability-helper";
import { useLiftStore } from "src/store";
import { updateSet } from "src/store/actions/setActions";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import { Action } from "src/utils/types/lib/Actions";
import {
  SetGroupCreate,
  SetGroupSlice,
  SetGroupUpdate,
} from "src/utils/types/SetGroup";
import { WorkoutJoin } from "src/utils/types/WorkoutJoin";
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
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        setGroups: {
          $push: [newSetGroup],
        },
      })
    );
  },
  _rollback({ id }, _) {
    const index = useLiftStore
      .getState()
      .setGroups.findIndex((setGroup) => setGroup.id === id);
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        setGroups: {
          $splice: [[index, 1]],
        },
      })
    );
  },
};

export const updateSetGroup: Action<SetGroupUpdate> = {
  dispatch(args) {
    dispatchAction<SetGroupUpdate>(updateSetGroup, args);
  },
  _commit({ id, ...args }) {
    return updateRemoteState<SetGroupUpdate>(
      `setgroups?id=eq.${id}`,
      "PATCH",
      args
    );
  },
  _store(args) {
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        setGroups: {
          $apply: (setGroups: SetGroupSlice[]) =>
            setGroups.map((setGroup) => {
              if (setGroup.id === args.id) {
                return {
                  ...setGroup,
                  ...args,
                };
              }
              return setGroup;
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
        setGroups: {
          $apply: (setGroups: SetGroupSlice[]) =>
            setGroups.map((setGroup) => {
              if (setGroup.id === id) {
                return {
                  ...setGroup,
                  ...previous,
                };
              }
              return setGroup;
            }),
        },
      })
    );
  },
};

type WorkoutJoinSetGroup = WorkoutJoin["setGroups"][0];
export const deleteSetGroup = (setGroup: WorkoutJoinSetGroup) => {
  const { id, sets } = setGroup;
  for (const set of sets) {
    updateSet.dispatch({
      id: set.id,
      archived: true,
    });
  }
  updateSetGroup.dispatch({
    id,
    archived: true,
  });
};
