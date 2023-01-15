import { AddonCategory } from "../../../../../../core/domain/addon/entity/AddonCategory";
import {
  AddonCategoryModel,
  ObjectionAddonCategory,
} from "../../models/addonCategory.model";

export class ObjectionAddonCategoryMapper {
  public static toPersistence(
    domainAddonCategory: AddonCategory,
  ): ObjectionAddonCategory {
    const objectionAddonCategory: ObjectionAddonCategory = {
      id: domainAddonCategory.getId(),
      name: domainAddonCategory.getAddonCategoryName().toLowerCase(),
      brand_id: domainAddonCategory.getBrandId(),
    };
    return objectionAddonCategory;
  }

  public static toDomainEntity(
    knexAddonCategory: AddonCategoryModel,
  ): AddonCategory {
    const domainAddonCategory: AddonCategory = new AddonCategory({
      id: knexAddonCategory.id,
      name: knexAddonCategory.name,
      brandId: knexAddonCategory.brand_id,
    });

    return domainAddonCategory;
  }
}
