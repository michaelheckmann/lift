/* 
1. The first line is the type alias we are defining.
2. We define a generic type T.
3. We check if T is a string. If it is, we return an empty array. This is the base case.
4. If T is not a string, we use the Extract<Type, ExcludedUnion> type operator to get all keys of type string from T.
   This is done by using the keyof operator to get all keys of T, then passing it to Extract.
5. We then use the keyof operator again to get all keys of T */
export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

/*
1. T extends string[]  -->  check if T is a string array
2. D extends string  -->  check if D is a string
3. T extends []  -->  check if T is an empty array
4. T extends [infer F]  -->  check if T is an array with one element, if so, assign the element to F
5. T extends [infer F, ...infer R]  -->  check if T is an array with at least two elements, if so,
   assign the first element to F and the rest elements to R
6. R extends []  -->  check if R is an empty array
7. F extends string  -->  check if F is a string
8. `${F}${D}${Join<Extract<R, string[]>, D>}`  -->  if F is a string, return F + D + R, otherwise, return an empty string */
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

/* 
1. We define a type Filter that takes two types T and U.
2. The first type T is an array of any type. The second type U is any type.
3. We check if the array T is empty. If it is, we return an empty array.
4. If T is not empty, we check if the first element in the array is of type U.
5. If it is, we return the filtered array by calling the Filter type on the rest of the array and the type U.
6. If the first element in the array is not of type U, we return the first element of the array
   and the filtered array by calling the Filter type on the rest of the array and the type U.
7. If the type is not an array, we return never. */
export type Filter<T extends any[], U extends any> = T extends []
  ? []
  : T extends [infer F, ...infer R]
  ? F extends U
    ? Filter<R, U>
    : [F, ...Filter<R, U>]
  : never;
