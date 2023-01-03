import update from "immutability-helper";
import { Action } from "src/utils/types/lib/Actions";
import { StoreType, useLiftStore } from "..";
import { QueueItem } from "../slices/operationsSlice";

// Actions
export const enqueueOperation = (operation: QueueItem) => {
  useLiftStore.setState(
    update(useLiftStore.getState(), {
      operations: {
        queue: {
          $push: [operation],
        },
      },
    })
  );
};

export const dequeueOperation = () => {
  const preState = useLiftStore.getState();
  const { obj, arg } = useLiftStore.getState().operations.queue[0];
  useLiftStore.setState(
    update(useLiftStore.getState(), {
      operations: {
        queue: {
          $splice: [[0, 1]],
        },
      },
    })
  );
  commitAction(obj, arg, preState);
};

export const toggleOnlineState = () => {
  useLiftStore.setState(
    update(useLiftStore.getState(), {
      operations: {
        config: {
          testing: {
            isOnline: {
              $toggle: ["value"],
            },
          },
        },
      },
    })
  );
};

export const toggleOnlineTesting = () => {
  useLiftStore.setState(
    update(useLiftStore.getState(), {
      operations: {
        config: {
          testing: {
            isOnline: {
              $toggle: ["enabled"],
            },
          },
        },
      },
    })
  );
};

export const setUserId = (userId: string | undefined) => {
  useLiftStore.setState(
    update(useLiftStore.getState(), {
      operations: {
        global: {
          userId: {
            $set: userId,
          },
        },
      },
    })
  );
};

export const setWorkoutSheetCollapsed = (value) => {
  useLiftStore.setState(
    update(useLiftStore.getState(), {
      operations: {
        global: {
          workoutSheetCollapsed: {
            $set: value,
          },
        },
      },
    })
  );
};

// This should be in the utils folder, but it's moved here
// to avoid circular dependencies
export const commitAction = (
  obj: Action<any>,
  arg: any,
  preState: StoreType
) => {
  obj._commit(arg).then((isSuccessful) => {
    console.log(`Commit was ${isSuccessful ? "successful" : "unsuccessful"}`);
    if (!isSuccessful) {
      obj._rollback(arg, preState);
    }
  });
};
