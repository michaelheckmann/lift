import {
  ClientExlude,
  ServerExcludeCreate,
  ServerExcludeUpdate,
} from "./lib/ExclusionHelper";

// Mirrors the shape on the server
type Exercise = {
  id: string;
  user_id: string;

  name: string;
  archived: boolean;

  created_at: Date;
  updated_at: Date;
};

export type ExerciseCreate = Omit<Exercise, ServerExcludeCreate>;
export type ExerciseUpdate = Partial<Omit<Exercise, ServerExcludeUpdate>>;

export type ExerciseSlice = Omit<Exercise, ClientExlude>;
