import "@rneui/themed";

// Custom extension of the default types
declare module "@rneui/themed" {
  export interface Colors {
    grey6: string;
    grey7: string;
  }
  export interface ThemeSpacing {
    xxs: number;
    xxl: number;
    axl: number;
    bxl: number;
    cxl: number;
    dxl: number;
    exl: number;
  }

  export interface Border {
    radius: {
      xs: number;
      sm: number;
      md: number;
    };
    width: {
      sm: number;
      md: number;
      lg: number;
    };
  }

  export interface Theme {
    border: Border;
  }
}
