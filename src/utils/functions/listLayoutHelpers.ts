import update from "immutability-helper";
import { ListItemLayout } from "../../component/Workout/Workout/Workout";

export function computeLayoutOffset(
  listLayout: ListItemLayout[],
  itemIndex: number = undefined,
  skipIndex: number = undefined
) {
  "worklet";
  if (listLayout.length === 0) {
    return 0;
  }

  if (itemIndex === undefined) {
    itemIndex = listLayout.length;
  }

  if (itemIndex < 0 || itemIndex > listLayout.length) {
    throw new Error(`Invalid item index: ${itemIndex}`);
  }

  let offset = 0;
  for (let i = 0; i < itemIndex; i++) {
    // This is necessary when an item is
    // being removed from the list and there not
    // taking into account when computing the offset
    if (skipIndex !== undefined && i === skipIndex) {
      continue;
    } else {
      offset += listLayout[i].relaxed.height;
    }
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
