// Used for certain actions that need custom inputs / outputs
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
