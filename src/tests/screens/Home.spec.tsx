import React from "react";

import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { navigationProps } from "src/config/jest";
import HomeScreen from "src/screens/WorkoutScreen";
import { useLiftStore } from "src/store";
import { defaultMockStore } from "src/store/mock";
import { renderOnion } from "src/utils/functions/renderOnion";

const useActiveWorkout = require("src/utils/hooks/useActiveWorkout");
const spy = jest.spyOn(useActiveWorkout, "useActiveWorkout");

describe("Previous Workout", () => {
  beforeAll(() => {
    useLiftStore.setState(defaultMockStore);
  });
  afterEach(cleanup);

  it("loads the active workout on startup if there is one", async () => {
    const workoutId = "wrk1";
    spy.mockReturnValue(workoutId);

    renderOnion(<HomeScreen {...navigationProps} />);
    expect(
      screen.getByText("Active Workout: " + workoutId, { exact: false })
    ).toBeVisible();
  });

  it("does not load the active workout on startup if there is none", async () => {
    spy.mockReturnValue(undefined);

    renderOnion(<HomeScreen {...navigationProps} />);
    await waitFor(() =>
      expect(screen.getByText("new workout", { exact: false })).toBeVisible()
    );
  });
});

describe("<HomeScreen />", () => {
  it("has at least 1 child", async () => {
    const tree: any = renderOnion(<HomeScreen {...navigationProps} />).toJSON();
    expect(tree.length).toBeGreaterThan(0);
  });
});

describe("Blank Workout", () => {
  beforeAll(() => {
    useLiftStore.setState(defaultMockStore);
  });

  it("creates a new workout, if the blank workout button is pressed", async () => {
    const dbSync = require("src/utils/functions/dbSync");
    jest
      .spyOn(dbSync, "updateRemoteState")
      .mockImplementation(() => Promise.resolve(true));
    spy.mockReturnValue(undefined);
    const workoutLength = useLiftStore.getState().workouts.length;
    renderOnion(<HomeScreen {...navigationProps} />);

    fireEvent.press(screen.getByText("Blank workout", { exact: false }));

    expect(useLiftStore.getState().workouts).toHaveLength(workoutLength + 1);
  });

  it("does not create a new workout, if the blank workout button is pressed and there is an active workout", async () => {
    spy.mockReturnValue("wrk1");
    const workoutLength = useLiftStore.getState().workouts.length;
    renderOnion(<HomeScreen {...navigationProps} />);

    fireEvent.press(screen.getByText("Blank workout", { exact: false }));
    expect(useLiftStore.getState().workouts).toHaveLength(workoutLength);
  });
});
