import { TextUtils } from "../../../common/util/text/TextUtils";
import { IsDate, IsString } from "class-validator";
import { v4 } from "uuid";
import { Entity } from "../../../common/entity/Entity";
import { CreateAddonCategoryEntityPayload } from "./type/CreateAddonCategoryEntityPayload";

export class AddonCategory extends Entity<string> {
  @IsString()
  private name: string;

  @IsString()
  private brandId: string;

  @IsDate()
  private readonly createdAt: Date;

  public getAddonCategoryName(): string {
    return this.name;
  }

  public getBrandId(): string {
    return this.brandId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  constructor(payload: CreateAddonCategoryEntityPayload) {
    super();
    this.name = TextUtils.toTitleCase(payload.name);
    this.id = payload.id || v4();
    this.brandId = payload.brandId;
    this.createdAt = payload.createdAt || new Date();
  }
  public static async new(
    payload: CreateAddonCategoryEntityPayload,
  ): Promise<AddonCategory> {
    const addonCategory: AddonCategory = new AddonCategory(payload);
    await addonCategory.validate();

    return addonCategory;
  }
}
