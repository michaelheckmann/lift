import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import "config/firebase";
import { useEffect } from "react";
import { useBlockStore } from "src/store";
import { dequeueOperation } from "src/store/actions/operationsActions";

export function useDBSync() {
  const { config, queue } = useBlockStore((state) => state.operations);

  const workQueue = () => {
    // console.log("WORK QUEUE", queue.length);
    if (queue.length > 0) {
      queue.forEach(() => dequeueOperation());
    }
  };

  useEffect(() => {
    // console.log("is online changed", config.testing.isOnline);
    const { enabled, value: isOnline } = config.testing.isOnline;
    let unsubscribe: NetInfoSubscription;

    if (enabled) {
      isOnline && workQueue();
    } else {
      unsubscribe = NetInfo.addEventListener((state) => {
        const { isConnected } = state;
        isConnected && workQueue();
      });
    }
    return unsubscribe && unsubscribe();
  }, [config.testing.isOnline]);
}
