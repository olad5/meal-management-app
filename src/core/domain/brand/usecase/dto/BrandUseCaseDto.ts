import { Exclude, Expose, plainToClass } from "class-transformer";
import { Brand } from "../../entity/Brand";

@Exclude()
export class BrandUseCaseDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  public static newFromBrand(brand: Brand): BrandUseCaseDto {
    return plainToClass(BrandUseCaseDto, brand);
  }
}
