import { cleanup, render } from "@testing-library/react-native";
import { act } from "react-test-renderer";
import { updateRemoteState } from "src/utils/functions/dbSync";
import { generateUUID } from "src/utils/functions/generateUUID";
import App from "../../../App";
import {
  toggleOnlineState,
  toggleOnlineTesting,
} from "../../store/actions/operationsActions";
import { createWorkout } from "../../store/actions/workoutsActions";
import { useBlockStore } from "../../store/index";
import { defaultMockStore } from "../../store/mock";
import { dispatchAction } from "../../store/utils";
import { WorkoutCreate } from "../../utils/types/Workout";

describe("Database sync", () => {
  beforeEach(() => {
    useBlockStore.setState(defaultMockStore);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("dispatches an action correctly", async () => {
    toggleOnlineTesting(); // Enable online testing

    const { isOnline } = useBlockStore.getState().operations.config.testing;
    expect(isOnline.enabled).toBe(true);
    expect(isOnline.value).toBe(true);

    const operationsActions = require("src/store/actions/operationsActions");
    const dbSync = require("src/utils/functions/dbSync");
    const spyCommitAction = jest.spyOn(operationsActions, "commitAction");
    const spyCommit = jest.spyOn(createWorkout, "_commit");
    const spyDBSync = jest
      .spyOn(dbSync, "updateRemoteState")
      .mockImplementation(() => Promise.resolve(true));

    const pl = {
      id: generateUUID("tst"),
      user_id: generateUUID("tst"),
    };

    await dispatchAction(createWorkout, pl);
    await new Promise(process.nextTick);

    expect(spyCommitAction).toHaveBeenCalled();
    expect(spyCommit).toHaveBeenCalledWith(pl);
    expect(spyDBSync).toHaveBeenCalled();
  });

  it("should queue local changes if the user is offline", async () => {
    toggleOnlineTesting(); // Enable online testing
    toggleOnlineState(); // Set online state to false

    const { isOnline } = useBlockStore.getState().operations.config.testing;
    const { queue } = useBlockStore.getState().operations;
    const queueLength = queue.length;
    expect(isOnline.enabled).toBe(true);
    expect(isOnline.value).toBe(false);

    const pl = {
      id: generateUUID("tst"),
      user_id: generateUUID("tst"),
    };

    await dispatchAction(createWorkout, pl);
    const operationsActions = require("src/store/actions/operationsActions");
    const dbSync = require("src/utils/functions/dbSync");
    const spyCommitAction = jest.spyOn(operationsActions, "commitAction");
    const spyCommit = jest.spyOn(createWorkout, "_commit");
    const spyDBSync = jest.spyOn(dbSync, "updateRemoteState");

    expect(spyCommitAction).not.toHaveBeenCalled();
    expect(spyCommit).not.toHaveBeenCalledWith(pl);
    expect(spyDBSync).not.toHaveBeenCalled();

    expect(useBlockStore.getState().operations.queue.length).toBe(
      queueLength + 1
    );
  });

  it("should push the queue to the database when the user comes back online", async () => {
    render(<App />);
    act(() => {
      toggleOnlineTesting(); // Enable online testing
      toggleOnlineState(); // Set online state to false
    });

    const dbSync = require("src/utils/functions/dbSync");
    const spyDBSync = jest
      .spyOn(dbSync, "updateRemoteState")
      .mockImplementation(() => Promise.resolve(true));

    const getQueueLength = () =>
      useBlockStore.getState().operations.queue.length;
    const initQueueLength = getQueueLength();

    const { isOnline } = useBlockStore.getState().operations.config.testing;
    expect(isOnline.enabled).toBe(true);
    expect(isOnline.value).toBe(false);

    await act(async () => {
      await dispatchAction(createWorkout, {
        id: generateUUID("tst"),
        user_id: generateUUID("tst"),
      });
    });

    expect(getQueueLength()).toBe(initQueueLength + 1);
    act(() => toggleOnlineState()); // Set online state to true
    expect(getQueueLength()).toBe(initQueueLength);
    expect(spyDBSync).toHaveBeenCalledTimes(1);
  });

  it("should update the remote state", async () => {
    const res = await updateRemoteState<WorkoutCreate>("workouts", "POST", {
      id: generateUUID("tst"),
      user_id: generateUUID("tst"),
    });
    expect(res).toBe(true);
  });
});
