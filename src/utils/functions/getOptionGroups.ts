import { IoniconType } from "./../types/lib/Ionicon";

export type OptionType = {
  label: string;
  icon: IoniconType;
  onPress: (args?: any) => any;
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
        onPress: () => {
          console.log("Light Mode");
        },
      },
      {
        label: "Dark Mode",
        icon: "moon-outline",
        onPress: () => {
          console.log("Dark Mode");
        },
      },
    ],
    [
      {
        label: "KG",
        icon: "body-outline",
        onPress: () => {
          console.log("KG");
        },
      },
      {
        label: "LBS",
        icon: "body-outline",
        onPress: () => {
          console.log("LBS");
        },
      },
    ],
    [
      {
        label: "Logout",
        icon: "log-out-outline",
        onPress: () => {
          console.log("KG");
        },
      },
    ],
  ];
}
