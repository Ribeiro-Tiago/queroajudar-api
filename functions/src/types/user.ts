export type UserType = "org" | "volunteer";

export interface BaseUser {
  email: string;
  password: string;
  type: UserType;
  name: string;
}

export interface User extends BaseUser {
  id: string;
}
