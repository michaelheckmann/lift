import "@rneui/themed";

// Custom extension of the default types
declare module "@rneui/themed" {
  export interface Colors {
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;

    primary50: string;
    primary100: string;
    primary200: string;
    primary300: string;
    primary400: string;
    primary500: string;
    primary600: string;
    primary700: string;
    primary800: string;
    primary900: string;

    secondary50: string;
    secondary100: string;
    secondary200: string;
    secondary300: string;
    secondary400: string;
    secondary500: string;
    secondary600: string;
    secondary700: string;
    secondary800: string;
    secondary900: string;

    accent50: string;
    accent100: string;
    accent200: string;
    accent300: string;
    accent400: string;
    accent500: string;
    accent600: string;
    accent700: string;
    accent800: string;
    accent900: string;

    success50: string;
    success100: string;
    success200: string;
    success300: string;
    success400: string;
    success500: string;
    success600: string;
    success700: string;
    success800: string;
    success900: string;

    warning50: string;
    warning100: string;
    warning200: string;
    warning300: string;
    warning400: string;
    warning500: string;
    warning600: string;
    warning700: string;
    warning800: string;
    warning900: string;

    error50: string;
    error100: string;
    error200: string;
    error300: string;
    error400: string;
    error500: string;
    error600: string;
    error700: string;
    error800: string;
    error900: string;
  }

  export interface ThemeSpacing {
    "0": number;
    "0.5": number;
    "1": number;
    "1.5": number;
    "2": number;
    "2.5": number;
    "3": number;
    "3.5": number;
    "4": number;
    "5": number;
    "6": number;
    "7": number;
    "8": number;
    "9": number;
    "10": number;
    "11": number;
    "12": number;
    "14": number;
    "16": number;
    "20": number;
    "24": number;
    "28": number;
    "32": number;
    "36": number;
    "40": number;
    "44": number;
    "48": number;
    "52": number;
    "56": number;
    "60": number;
    "64": number;
    "72": number;
    "80": number;
    "96": number;
  }

  export interface BorderRadius {
    none: number;
    sm: number;
    md: number;
    lg: number;
    full: number;
  }

  export interface Theme {
    borderRadius: BorderRadius;
  }
}
