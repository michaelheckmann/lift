import {
  ClientExlude,
  ServerExcludeCreate,
  ServerExcludeUpdate,
  ServerIncludeUpdate,
} from "./lib/Helpers";

// Mirrors the shape on the server
type SetGroup = {
  id: string;

  order: number;
  archived: boolean;

  exercise_id: string;
  workout_id: string;

  created_at: Date;
  updated_at: Date;
};

export type SetGroupCreate = Omit<SetGroup, ServerExcludeCreate>;
export type SetGroupUpdate = Partial<Omit<SetGroup, ServerExcludeUpdate>> &
  ServerIncludeUpdate;

export type SetGroupSlice = Omit<SetGroup, ClientExlude>;
