import { FieldValue } from "firebase/firestore";
import { Exercise } from "./Exercise";

export type Set = {
  order: number;
  set_type: "drop_set" | "normal";
  note?: string;
  reps: number;
  weight: number;
  done: boolean;
};

export type SetGroup = {
  id?: string;
  exercise: Exercise;
  order: number;
  sets: Set[];
  note?: string;
};

export type Workout = {
  id?: string;
  done: boolean;
  user_id: string;
  date: Date | FieldValue;
  setGroups?: SetGroup[];
};
