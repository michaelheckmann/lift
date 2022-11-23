import { StoreType } from "src/store";

type BaseAction<T> = {
  _store: (arg: T) => void;
  _commit: (arg: T) => Promise<boolean>;
  _rollback: (arg: T, db: StoreType) => void;
};

type CreateAction<T, U> = BaseAction<T> & {
  dispatch: (arg: U) => string;
};

type UpdateAction<T> = BaseAction<T> & {
  dispatch: (arg: T) => void;
};

export type Action<T, U = void> = U extends void
  ? UpdateAction<T>
  : CreateAction<T, U>;
