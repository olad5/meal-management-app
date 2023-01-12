import { Optional } from "../../../../common/type/CommonTypes";
import { Brand } from "../../entity/Brand";

export interface BrandRepositoryPort {
  findBrandByBrandId(brandId: string): Promise<Optional<Brand>>;
  findBrandByBrandName(brandName: string): Promise<Optional<Brand>>;
  createBrand(brand: Brand): Promise<void>;
}
