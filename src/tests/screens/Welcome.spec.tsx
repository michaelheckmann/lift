import React from "react";

import WelcomeScreen from "screens/WelcomeScreen";
import { navigationProps } from "src/config/jest";
import { renderOnion } from "src/utils/functions/renderOnion";

describe("<WelcomeScreen />", () => {
  it("has at least 1 child", async () => {
    const tree: any = renderOnion(
      <WelcomeScreen {...navigationProps} />
    ).toJSON();
    expect(tree.children.length).toBeGreaterThan(0);
  });
});
