import { Optional } from "../../../../common/type/CommonTypes";
import { AddonCategory } from "../../entity/AddonCategory";

export interface AddonCategoryRepositoryPort {
  findAddonCategoryByName(name: string): Promise<Optional<AddonCategory>>;
  createAddonCategory(category: AddonCategory): Promise<void>;
}
