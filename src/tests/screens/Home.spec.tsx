import React from "react";

import { screen, waitFor } from "@testing-library/react-native";
import { navigationProps } from "src/config/jest";
import HomeScreen from "src/screens/HomeScreen";
import { useBlockStore } from "src/store";
import { defaultMockStore } from "src/store/mock";
import { renderOnion } from "src/utils/functions/renderOnion";

const useActiveWorkout = require("src/utils/hooks/useActiveWorkout");
const spy = jest.spyOn(useActiveWorkout, "useActiveWorkout");

describe("Previous Workout", () => {
  beforeAll(() => {
    useBlockStore.setState(defaultMockStore);
  });

  it("loads the active workout on startup if there is one", async () => {
    const workoutId = "1";
    spy.mockReturnValue(workoutId);

    renderOnion(<HomeScreen {...navigationProps} />);
    await waitFor(() =>
      expect(screen.getByText(workoutId, { exact: false })).toBeVisible()
    );
  });
  it("does not load the active workout on startup if there is none", async () => {
    spy.mockReturnValue(undefined);

    renderOnion(<HomeScreen {...navigationProps} />);
    await waitFor(() =>
      expect(screen.getByText("new workout", { exact: false })).toBeVisible()
    );
  });
});
