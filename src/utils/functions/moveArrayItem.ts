/**
 * It takes an array, removes an item from it, and inserts it at a new position
 * @param {any[]} array - The array to be modified
 * @param {number} from - The index of the item to be moved
 * @param {number} to - The index of the array where the item should be moved to.
 * @returns A new array with the item moved to the new position.
 */
export function moveArrayItem(array: any[], from: number, to: number): any[] {
  "worklet";
  const newArray = [...array]; // Copy array
  const item = newArray[from]; // Copy item to be moved
  newArray.splice(from, 1); // Remove item from original position
  newArray.splice(to, 0, item); // Insert item at new position
  return newArray; // Return new array
}
