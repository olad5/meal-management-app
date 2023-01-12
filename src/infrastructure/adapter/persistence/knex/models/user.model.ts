import { BaseModel } from "./base.model";

export class UserModel extends BaseModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "ADMIN" | "BASE_USER";
  password: string;

  static get tableName(): string {
    return "user";
  }
  static get idColumn(): string {
    return "id";
  }
}

export type ObjectionUser = Pick<
  UserModel,
  "id" | "email" | "first_name" | "last_name" | "password" | "role"
>;
