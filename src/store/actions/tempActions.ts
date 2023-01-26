import update from "immutability-helper";
import { useTempStore } from "..";

export const setLastFinishedSet = (value) => {
  useTempStore.setState(
    update(useTempStore.getState(), {
      lastFinishedSet: {
        $set: value,
      },
    })
  );
};
