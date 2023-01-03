import NetInfo from "@react-native-community/netinfo";
import { useLiftStore } from "src/store";
import { Action } from "src/utils/types/lib/Actions";
import { commitAction, enqueueOperation } from "./actions/operationsActions";

/**
 * This function handles the main logic for mutation the store and the database.
 * It takes an action object and an argument, and then it either commits the action or enqueues it
 * @param obj - The action object that you want to dispatch.
 * @param {T} arg - The argument passed to the action
 */
export const dispatchAction = async <T>(obj: Action<T>, arg: T) => {
  const preState = useLiftStore.getState();
  obj._store(arg);

  const { enabled, value } =
    useLiftStore.getState().operations.config.testing.isOnline;
  let isOnline = value;

  if (!enabled) {
    const connectionInfo = await NetInfo.fetch();
    isOnline = connectionInfo.isConnected;
  }

  if (isOnline) {
    console.log("committing action", arg);
    commitAction(obj, arg, preState);
  } else {
    console.log("enqueueing action", arg);
    enqueueOperation({ obj, arg });
  }
};
