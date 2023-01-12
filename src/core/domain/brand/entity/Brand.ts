import { TextUtils } from "../../../common/util/text/TextUtils";
import { IsDate, IsString } from "class-validator";
import { v4 } from "uuid";
import { Entity } from "../../../common/entity/Entity";
import { CreateBrandEntityPayload } from "./type/CreateBrandEntityPayload";

export class Brand extends Entity<string> {
  @IsString()
  private name: string;

  @IsDate()
  private readonly createdAt: Date;

  constructor(payload: CreateBrandEntityPayload) {
    super();
    this.name = TextUtils.toTitleCase(payload.name);
    this.id = payload.id || v4();
    this.createdAt = payload.createdAt || new Date();
  }

  public getBrandName(): string {
    return this.name;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public static async new(payload: CreateBrandEntityPayload): Promise<Brand> {
    const brand: Brand = new Brand(payload);
    await brand.validate();

    return brand;
  }
}
