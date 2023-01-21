import update from "immutability-helper";
import { ListItemLayout } from "../../component/Workout/Workout/Workout";

/**
 * It takes a list of `ListItemLayout` objects and returns the sum of the heights of the first
 * `itemIndex` items
 * @param {ListItemLayout[]} listLayout - The list of items' layout.
 * @param {number} itemIndex - The index of the item to compute the offset for. If undefined, the
 * offset for the last item is computed.
 * @returns The offset of the item in the list.
 */
export function computeLayoutOffset(
  listLayout: ListItemLayout[],
  itemIndex: number = undefined
) {
  "worklet";
  // If the list is empty, the offset is 0.
  if (listLayout.length === 0) {
    return 0;
  }

  // If no item index is provided, we compute the offset of the bottom of the
  // list.
  if (itemIndex === undefined) {
    itemIndex = listLayout.length;
  }

  // If the index is out of range, throw an error.
  if (itemIndex < 0 || itemIndex > listLayout.length) {
    throw new Error(`Invalid item index: ${itemIndex}`);
  }

  // The offset is the sum of the heights of the items before the index.
  let offset = 0;
  for (let i = 0; i < itemIndex; i++) {
    offset += listLayout[i].relaxed.height;
  }
  return offset;
}

export function setListLayoutValue(
  listLayout: ListItemLayout,
  mode: "tight" | "relaxed",
  property: "top" | "height",
  value: number
) {
  "worklet";
  return update(listLayout, {
    [mode]: {
      [property]: {
        $set: value,
      },
    },
  });
}
