import { act, cleanup, fireEvent, screen } from "@testing-library/react-native";
import React from "react";

import { navigationProps } from "src/config/jest";

import SettingsScreen from "src/screens/ProfileScreen";
import { useLiftStore } from "src/store";
import { defaultMockStore } from "src/store/mock";
import { renderOnion } from "src/utils/functions/renderOnion";

describe("<SettingsScreen />", () => {
  beforeEach(() => cleanup());

  it("has at least 1 child", async () => {
    const tree: any = renderOnion(
      <SettingsScreen {...navigationProps} />
    ).toJSON();
    // screen.debug();
    expect(tree.children.length).toBeGreaterThan(0);
  });

  it("should change the theme", async () => {
    const getTheme = () => useLiftStore.getState().settings.theme;
    renderOnion(<SettingsScreen {...navigationProps} />);

    expect(getTheme()).toBe(defaultMockStore.settings.theme);

    act(() => {
      const themeSwitch = screen.getByTestId("theme-switch");
      fireEvent(themeSwitch, "valueChange", true);
    });

    expect(getTheme()).not.toBe(defaultMockStore.settings.theme);
  });
});
