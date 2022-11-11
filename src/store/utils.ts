import NetInfo from "@react-native-community/netinfo";
import { useBlockStore } from "src/store";
import { StoreType } from ".";
import { ActionExclude } from "../utils/types/lib/ExclusionHelper";
import { commitAction, enqueueOperation } from "./actions/operationsActions";

export type Action<T> = {
  dispatch: (arg: Omit<T, ActionExclude>) => void;
  _store: (arg: T) => void;
  _commit: (arg: T) => Promise<boolean>;
  _rollback: (arg: T, db: StoreType) => void;
};

export const dispatchAction = async <T, U>(obj: Action<T> & U, arg: T) => {
  const preState = useBlockStore.getState();
  obj._store(arg);

  const { enabled, value } =
    useBlockStore.getState().operations.config.testing.isOnline;
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
