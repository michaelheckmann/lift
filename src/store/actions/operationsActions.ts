import update from "immutability-helper";
import { Action } from "src/utils/types/lib/Actions";
import { StoreType, useBlockStore } from "..";
import { QueueItem } from "../slices/operationsSlice";

// Actions
export const enqueueOperation = (operation: QueueItem) => {
  useBlockStore.setState(
    update(useBlockStore.getState(), {
      operations: {
        queue: {
          $push: [operation],
        },
      },
    })
  );
};

export const dequeueOperation = () => {
  const preState = useBlockStore.getState();
  const { obj, arg } = useBlockStore.getState().operations.queue[0];
  useBlockStore.setState(
    update(useBlockStore.getState(), {
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
  useBlockStore.setState(
    update(useBlockStore.getState(), {
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
  useBlockStore.setState(
    update(useBlockStore.getState(), {
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
  useBlockStore.setState(
    update(useBlockStore.getState(), {
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
