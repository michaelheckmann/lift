import {
  CollectionReference,
  DocumentData,
  getFirestore,
} from "firebase/firestore";
// https://plainenglish.io/blog/using-firestore-with-typescript-in-the-v9-sdk-cf36851bb099

import { collection } from "firebase/firestore";
import { Profile } from "utils/types/Profile";
import { SetGroup, Workout } from "../types/Workout";
import { Exercise } from "./../types/Exercise";

const db = getFirestore();

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

// Construct a database helper object
export const collections = {
  // list your collections here
  profiles: createCollection<Profile>("profiles"),
  workouts: createCollection<Workout>("workouts"),
  exercises: createCollection<Exercise>("exercises"),
  setGroups: (workoutId: string) =>
    createCollection<SetGroup>(`workouts/${workoutId}/setGroups`),
};
