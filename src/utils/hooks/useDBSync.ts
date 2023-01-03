import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import "config/firebase";
import { useEffect } from "react";
import { useLiftStore } from "src/store";
import { dequeueOperation } from "src/store/actions/operationsActions";

/**
 * If the app is online, work the queue. If the app is offline, queue changes and
 * work the queue when the app comes back online.
 */
export function useDBSync() {
  const { config, queue } = useLiftStore((state) => state.operations);

  const workQueue = () => {
    // console.log("WORK QUEUE", queue.length);
    if (queue.length > 0) {
      queue.forEach(() => dequeueOperation());
    }
  };

  useEffect(() => {
    // This is used to mock the online state
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
