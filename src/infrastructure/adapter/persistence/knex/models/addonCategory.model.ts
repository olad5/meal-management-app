import { BaseModel } from "./base.model";

export class AddonCategoryModel extends BaseModel {
  id: string;
  name: string;
  brand_id: string;

  static get tableName(): string {
    return "category";
  }
  static get idColumn(): string {
    return "id";
  }
}

export type ObjectionAddonCategory = Pick<
  AddonCategoryModel,
  "id" | "name" | "brand_id"
>;
