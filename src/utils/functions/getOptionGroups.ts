import { IoniconType } from "./../types/lib/Ionicon";

export type OptionLabel =
  | "Light Mode"
  | "Dark Mode"
  | "Halloween"
  | "KG"
  | "LBS"
  | "Logout";

export type OptionType = {
  label: OptionLabel;
  icon: IoniconType;
};

/**
 * It returns an array of OptionGroups
 * Each OptionGroup is an array of options
 * @returns An array of arrays of options.
 */
export function getOptionGroups(): OptionType[][] {
  return [
    [
      {
        label: "Light Mode",
        icon: "sunny-outline",
      },
      {
        label: "Dark Mode",
        icon: "moon-outline",
      },
      {
        label: "Halloween",
        icon: "skull-outline",
      },
    ],
    [
      {
        label: "KG",
        icon: "body-outline",
      },
      {
        label: "LBS",
        icon: "body-outline",
      },
    ],
    [
      {
        label: "Logout",
        icon: "log-out-outline",
      },
    ],
  ];
}
