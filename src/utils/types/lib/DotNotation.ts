export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? R extends []
    ? F
    : F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type Filter<T extends any[], U extends any> = T extends []
  ? []
  : T extends [infer F, ...infer R]
  ? F extends U
    ? Filter<R, U>
    : [F, ...Filter<R, U>]
  : never;
