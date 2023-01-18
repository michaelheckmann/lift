import { ThemeSpacing } from "@rneui/themed";

export function getSetGroupHeaderHeight(spacing: ThemeSpacing) {
  return (
    // SetGroup.header.height
    spacing["11"] +
    // SetGroup.header.marginBottom
    spacing["4"]
  );
}

export function getSetHeight(spacing: ThemeSpacing) {
  return (
    // Set.container.height
    spacing["12"]
  );
}

export function getSetGroupContentHeight(
  spacing: ThemeSpacing,
  numberOfSets: number
) {
  return (
    // SetHeader.setsHeader.height
    spacing["9"] +
    // Set.container.height
    numberOfSets * getSetHeight(spacing) +
    // SetGroupContent.setGroupContainer.borderWidth
    spacing["0.5"] * 2 +
    // SetGroupContent.addSetButton.height
    spacing["9"] +
    // SetGroupContent.addSetButton.marginTop
    spacing["4"] +
    // This is additional height that is used
    // as padding to the bottom of the set group
    spacing["8"]
  );
}

export function getSetGroupHeight(spacing: ThemeSpacing, numberOfSets: number) {
  return (
    getSetGroupHeaderHeight(spacing) +
    getSetGroupContentHeight(spacing, numberOfSets)
  );
}

export function getSetGroupFooterHeight(spacing: ThemeSpacing) {
  return (
    // SetGroupListFooter.addSetGroupButton.height
    spacing["12"] +
    // SetGroupListFooter.addSetGroupButton.marginBottom
    spacing["4"] +
    // SetGroupListFooter.finishWorkoutButton.height
    spacing["12"] +
    // SetGroupListFooter.finishWorkoutButton.marginBottom
    spacing["4"]
  );
}
