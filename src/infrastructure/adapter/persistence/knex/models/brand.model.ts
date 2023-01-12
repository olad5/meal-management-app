import { BaseModel } from "./base.model";

export class BrandModel extends BaseModel {
  id: string;
  name: string;

  static get tableName(): string {
    return "brand";
  }
  static get idColumn(): string {
    return "id";
  }
}

export type ObjectionBrand = Pick<BrandModel, "id" | "name">;
