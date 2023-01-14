import { Exclude, Expose, plainToClass } from "class-transformer";
import { Addon } from "../../entity/Addon";

@Exclude()
export class AddonUseCaseDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose()
  public category: string;

  @Expose()
  public brandId: string;

  @Expose()
  public price: number;

  public static newFromAddon(addon: Addon): AddonUseCaseDto {
    return plainToClass(AddonUseCaseDto, addon);
  }

  public static newListFromAddons(addons: Addon[]): AddonUseCaseDto[] {
    return addons.map((addon) => this.newFromAddon(addon));
  }
}
