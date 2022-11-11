import {
  ClientExlude,
  ServerExcludeCreate,
  ServerExcludeUpdate,
} from "./lib/ExclusionHelper";

type Themes = "light" | "dark";

type Setting = {
  id: string;
  user_id: string;

  theme: Themes;
  archived: boolean;

  created_at: Date;
  updated_at: Date;
};

export type SettingCreate = Omit<Setting, ServerExcludeCreate>;
export type SettingUpdate = Partial<Omit<Setting, ServerExcludeUpdate>>;

export type SettingSlice = Omit<Setting, ClientExlude>;
