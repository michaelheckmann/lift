export type ClientExlude = "user_id" | "created_at" | "updated_at";

export type ServerExclude = "created_at" | "updated_at";
export type ServerExcludeCreate = ServerExclude | "archived" | "done";
export type ServerExcludeUpdate = ServerExclude | "id" | "user_id";

export type ActionExclude = "id" | "user_id";
