import { Exclude, Expose, plainToClass } from "class-transformer";
import { AddonCategory } from "../../entity/AddonCategory";

@Exclude()
export class AddonCategoryUseCaseDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public brandId: string;

  public static newFromAddonCategory(
    addonCategory: AddonCategory,
  ): AddonCategoryUseCaseDto {
    return plainToClass(AddonCategoryUseCaseDto, addonCategory);
  }
}
