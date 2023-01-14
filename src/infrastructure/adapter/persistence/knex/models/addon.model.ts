import { BaseModel } from "./base.model";

export class AddonModel extends BaseModel {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand_id: string;

  static get tableName(): string {
    return "addon";
  }
  static get idColumn(): string {
    return "id";
  }
}

export type ObjectionAddon = Pick<
  AddonModel,
  "id" | "name" | "price" | "description" | "category" | "brand_id"
>;
