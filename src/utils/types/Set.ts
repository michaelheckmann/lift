import {
  ClientExlude,
  ServerExcludeCreate,
  ServerExcludeUpdate,
  ServerIncludeUpdate,
} from "./lib/Helpers";

// Mirrors the shape on the server
type Set = {
  id: string;

  weight: number;
  reps: number;
  done: boolean;
  archived: boolean;

  setgroup_id: string;

  created_at: Date;
  updated_at: Date;
};

export type SetCreate = Omit<Set, ServerExcludeCreate>;
export type SetUpdate = Partial<Omit<Set, ServerExcludeUpdate>> &
  ServerIncludeUpdate;

export type SetSlice = Omit<Set, ClientExlude>;
