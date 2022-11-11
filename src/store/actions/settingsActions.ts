import { useBlockStore } from "src/store";
import { updateRemoteState } from "src/utils/functions/dbSync";

import update from "immutability-helper";
import { SettingUpdate } from "src/utils/types/Settings";
import { Action, dispatchAction } from "../utils";

// Actions
export const updateSettings: Action<SettingUpdate> = {
  dispatch(settings) {
    dispatchAction(updateSettings, settings);
  },
  _commit(settings) {
    const userId = useBlockStore.getState().operations.global.userId;
    return updateRemoteState<SettingUpdate>(
      `settings?user_id=eq.${userId}`,
      "PATCH",
      settings
    );
  },
  _store(settings) {
    useBlockStore.setState(
      update(useBlockStore.getState(), {
        settings: {
          $merge: settings,
        },
      })
    );
  },
  _rollback(_, previousState) {
    const previous = previousState.settings;
    useBlockStore.setState(
      update(useBlockStore.getState(), {
        settings: {
          $merge: previous,
        },
      })
    );
  },
};
