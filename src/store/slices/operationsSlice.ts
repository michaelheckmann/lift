// Types

import { Action } from "src/utils/types/lib/Actions";

export type QueueItem = {
  obj: Action<any>;
  arg: any;
};

type ConfigItemType<T> = {
  enabled: boolean;
  value: T;
};

type OperationsConfigType = {
  testing: {
    isOnline: ConfigItemType<boolean>;
  };
  debug: {
    log: ConfigItemType<"*" | "info">;
  };
};

type OperationsGlobalType = {
  userId?: string;
  workoutSheetCollapsed?: boolean;
};

export type OperationSlice = {
  queue: QueueItem[];
  config: OperationsConfigType;
  global: OperationsGlobalType;
};

// State
export const operationsState: OperationSlice = {
  queue: [],
  config: {
    testing: {
      isOnline: {
        enabled: false,
        value: true,
      },
    },
    debug: {
      log: {
        enabled: false,
        value: "*",
      },
    },
  },
  global: {
    userId: undefined,
    workoutSheetCollapsed: undefined,
  },
};
