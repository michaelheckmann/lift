import {
  ClientExlude,
  ServerExcludeCreate,
  ServerExcludeUpdate,
  ServerIncludeUpdate,
} from "./lib/Helpers";

export type Themes = "light" | "dark" | "halloween";

// Mirrors the shape on the server
type Setting = {
  id: string;
  user_id: string;

  theme: Themes;
  archived: boolean;

  created_at: Date;
  updated_at: Date;
};

export type SettingCreate = Omit<Setting, ServerExcludeCreate>;
export type SettingUpdate = Partial<Omit<Setting, ServerExcludeUpdate>> &
  ServerIncludeUpdate;

export type SettingSlice = Omit<Setting, ClientExlude>;
