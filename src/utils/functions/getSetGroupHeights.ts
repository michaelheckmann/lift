import { ThemeSpacing } from "@rneui/themed";

/**
 * It takes in a spacing object and a number of sets and returns the height of a set group
 * @param {ThemeSpacing} spacing - ThemeSpacing
 * @param {number} numberOfSets - The number of sets in the group.
 * @returns The height of the set group.
 */

export function getSetGroupContentHeight(
  spacing: ThemeSpacing,
  numberOfSets: number
) {
  "worklet";
  return (
    // SetHeader.setsHeader.height
    spacing["9"] +
    // Set.container.height
    numberOfSets * spacing["12"] +
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
