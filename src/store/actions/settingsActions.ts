import { useLiftStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";

import update from "immutability-helper";
import { Action } from "src/utils/types/lib/Actions";
import { SettingUpdate } from "src/utils/types/Settings";
import { dispatchAction } from "../utils";

// Actions
export const updateSettings: Action<SettingUpdate> = {
  dispatch(args) {
    dispatchAction(updateSettings, args);
  },
  _commit({ id, ...args }) {
    return updateRemoteState<SettingUpdate>(
      `settings?id=eq.${id}`,
      "PATCH",
      args
    );
  },
  _store(args) {
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        settings: {
          $merge: args,
        },
      })
    );
  },
  _rollback(_, previousState) {
    const previous = previousState.settings;
    useLiftStore.setState(
      update(useLiftStore.getState(), {
        settings: {
          $merge: previous,
        },
      })
    );
  },
};
