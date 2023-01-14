import { TextUtils } from "../../../common/util/text/TextUtils";
import { IsDate, IsNumber, IsString } from "class-validator";
import { v4 } from "uuid";
import { Entity } from "../../../common/entity/Entity";
import { CreateAddonEntityPayload } from "./type/CreateBrandEntityPayload";

export class Addon extends Entity<string> {
  @IsString()
  private name: string;

  @IsString()
  private description: string;

  @IsNumber()
  private price: number;

  @IsString()
  private category: string;

  @IsString()
  private brandId: string;

  @IsDate()
  private readonly createdAt: Date;

  public getAddonName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getBrandId(): string {
    return this.brandId;
  }

  public getCategory(): string {
    return this.category;
  }
  public getPrice(): number {
    return this.price;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  constructor(payload: CreateAddonEntityPayload) {
    super();
    this.name = TextUtils.toTitleCase(payload.name);
    this.id = payload.id || v4();
    this.price = payload.price;
    this.description = payload.description;
    this.brandId = payload.brandId;
    this.category = TextUtils.toTitleCase(payload.category);
    this.createdAt = payload.createdAt || new Date();
  }
  public static async new(payload: CreateAddonEntityPayload): Promise<Addon> {
    const brand: Addon = new Addon(payload);
    await brand.validate();

    return brand;
  }
}
