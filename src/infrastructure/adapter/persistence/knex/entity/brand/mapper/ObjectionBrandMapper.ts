import { Brand } from "../../../../../../../core/domain/brand/entity/Brand";
import { BrandModel, ObjectionBrand } from "../../../models/brand.model";

export class ObjectionBrandMapper {
  public static toPersistence(domainBrand: Brand): ObjectionBrand {
    const objectionBrand: ObjectionBrand = {
      id: domainBrand.getId(),
      name: domainBrand.getBrandName().toLowerCase(),
    };
    return objectionBrand;
  }

  public static toDomainEntity(knexBrand: BrandModel): Brand {
    const domainBrand: Brand = new Brand({
      id: knexBrand.id,
      name: knexBrand.name,
    });

    return domainBrand;
  }
}
