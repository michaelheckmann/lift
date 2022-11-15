import React from "react";

import { navigationProps } from "src/config/jest";

import RegisterScreen from "src/screens/RegisterScreen";
import { renderOnion } from "src/utils/functions/renderOnion";

describe("<RegisterScreen />", () => {
  it("has at least 1 child", async () => {
    const tree: any = renderOnion(
      <RegisterScreen {...navigationProps} />
    ).toJSON();
    // screen.debug();
    expect(tree.children.length).toBeGreaterThan(0);
  });
});
