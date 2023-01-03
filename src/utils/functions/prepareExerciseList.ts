import { ExerciseSlice } from "src/utils/types/Exercise";

/**
 * If the search input is empty, return the exercises, otherwise return the exercises that include the
 * search input in their name.
 * @param {ExerciseSlice[]} exercises - ExerciseSlice[] - this is the list of exercises that we want to
 * filter
 * @param {string} searchInput - string - The search input from the user
 * @returns An array of exercises that have a name that includes the searchInput
 */
function filterExerciseList(exercises: ExerciseSlice[], searchInput: string) {
  if (searchInput === "") {
    return exercises;
  }
  return exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchInput.toLowerCase())
  );
}

/**
 * It takes an array of exercises and returns an array of sticky headers
 * @param {ExerciseSlice[]} exercises - ExerciseSlice[]
 * @returns An array of objects with the index of the exercise and the first letter of the exercise
 * name.
 */
function addStickyHeaders(exercises: ExerciseSlice[]) {
  const stickyHeaders = [];
  let lastLetter = "";
  exercises.forEach((exercise, index) => {
    const firstLetter = exercise.name[0].toUpperCase();
    if (firstLetter !== lastLetter) {
      // + stickyHeaders.length is necessary
      // because as the sticky headers are added
      // the index of the exercises change
      stickyHeaders.push({
        index: index + stickyHeaders.length,
        letter: firstLetter,
      });
      lastLetter = firstLetter;
    }
  });
  return stickyHeaders;
}

export /**
 * "Given a list of exercises and a search input, return a sorted list of exercises with sticky
 * headers."
 *
 * The function is broken down into three steps:
 *
 * 1. Filter the list of exercises based on the search input.
 * 2. Sort the filtered list of exercises.
 * 3. Add sticky headers to the sorted list of exercises
 * @param {ExerciseSlice[]} exercises - ExerciseSlice[] - this is the list of exercises that we
 * want to sort and filter
 * @param {string} searchInput - The string that the user has typed into the search bar.
 * @returns An object with two properties: sortedList and stickyHeaders.
 */
function prepareExerciseList(exercises: ExerciseSlice[], searchInput: string) {
  const filteredList = filterExerciseList(exercises, searchInput);
  const sortedList = filteredList.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  const stickyHeaders = addStickyHeaders(sortedList);
  stickyHeaders.forEach((header) => {
    sortedList.splice(header.index, 0, {
      name: header.letter,
      id: `${header.letter}-header`,
      archived: false,
    });
  });
  return {
    sortedList,
    stickyHeaders: stickyHeaders.map((header) => header.index),
  };
}
