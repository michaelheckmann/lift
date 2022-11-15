import React from "react";

import { navigationProps } from "src/config/jest";

import LoginScreen from "src/screens/LoginScreen";
import { renderOnion } from "src/utils/functions/renderOnion";

describe("<LoginScreen />", () => {
  it("has at least 1 child", async () => {
    const tree: any = renderOnion(
      <LoginScreen {...navigationProps} />
    ).toJSON();
    // screen.debug();
    expect(tree.children.length).toBeGreaterThan(0);
  });
});
