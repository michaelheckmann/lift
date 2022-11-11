import { generateUUID } from "src/utils/functions/generateUUID";
import { SettingSlice } from "src/utils/types/Settings";

// State
export const settingsState: SettingSlice = {
  id: generateUUID("stt"),
  theme: "light",
  archived: false,
};
