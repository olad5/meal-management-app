import { Inject } from "@nestjs/common";
import { AddonCategory } from "../../../../../../core/domain/addon/entity/AddonCategory";
import { AddonCategoryRepositoryPort } from "../../../../../../core/domain/addon/port/persistence/AddonCategoryRepositoryPort";
import { ObjectionAddonCategoryMapper } from "../../entity/addonCategory/ObjectionAddonCategoryMapper";
import { AddonCategoryModel } from "../../models/addonCategory.model";

export class ObjectionAddonCategoryRepositoryAdapter
  implements AddonCategoryRepositoryPort
{
  constructor(
    @Inject(AddonCategoryModel)
    private readonly addonCategoryModel: typeof AddonCategoryModel,
  ) {}

  async createAddonCategory(category: AddonCategory): Promise<void> {
    const objectionAddonCategory =
      ObjectionAddonCategoryMapper.toPersistence(category);
    await this.addonCategoryModel.query().insert({
      ...objectionAddonCategory,
    });
  }

  async findAddonCategoryByName(name: string): Promise<AddonCategory> {
    const objectionAddonCategory = await this.addonCategoryModel
      .query()
      .findOne("name", name.toLowerCase());
    return objectionAddonCategory
      ? ObjectionAddonCategoryMapper.toDomainEntity(objectionAddonCategory)
      : undefined;
  }
}
