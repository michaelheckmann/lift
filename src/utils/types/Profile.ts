type Settings = {
  theme: "light" | "dark";
};

export type Profile = {
  id?: string;
  settings: Settings;
};

export const defaultProfile: Profile = {
  settings: {
    theme: "light",
  },
};
