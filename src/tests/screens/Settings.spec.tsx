import React from "react";

import { navigationProps } from "src/config/jest";

import SettingsScreen from "src/screens/SettingsScreen";
import { renderOnion } from "src/utils/functions/renderOnion";

describe("<SettingsScreen />", () => {
  it("has at least 1 child", async () => {
    const tree: any = renderOnion(
      <SettingsScreen {...navigationProps} />
    ).toJSON();
    // screen.debug();
    expect(tree.children.length).toBeGreaterThan(0);
  });
});
