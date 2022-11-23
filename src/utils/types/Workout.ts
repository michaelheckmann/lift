import {
  ClientExlude,
  ServerExcludeCreate,
  ServerExcludeUpdate,
  ServerIncludeUpdate,
} from "./lib/Helpers";

// Mirrors the shape on the server
type Workout = {
  id: string;
  user_id: string;

  done: boolean;
  archived: boolean;

  created_at: Date;
  updated_at: Date;
};

export type WorkoutCreate = Omit<Workout, ServerExcludeCreate>;
export type WorkoutUpdate = Partial<Omit<Workout, ServerExcludeUpdate>> &
  ServerIncludeUpdate;

type ClientKeep = Pick<Workout, "created_at">;

export type WorkoutSlice = Omit<Workout, ClientExlude> & ClientKeep;
