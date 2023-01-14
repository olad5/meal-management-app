import { Addon } from "../../../../../../../core/domain/addon/entity/Addon";
import { AddonModel, ObjectionAddon } from "../../../models/addon.model";

export class ObjectionAddonMapper {
  public static toPersistence(domainAddon: Addon): ObjectionAddon {
    const objectionAddon: ObjectionAddon = {
      id: domainAddon.getId(),
      price: domainAddon.getPrice(),
      description: domainAddon.getDescription(),
      name: domainAddon.getAddonName().toLowerCase(),
      category: domainAddon.getCategory().toLowerCase(),
      brand_id: domainAddon.getBrandId(),
    };
    return objectionAddon;
  }

  public static toDomainEntity(knexAddon: AddonModel): Addon {
    const domainAddon: Addon = new Addon({
      id: knexAddon.id,
      name: knexAddon.name,
      description: knexAddon.description,
      price: knexAddon.price,
      brandId: knexAddon.brand_id,
      category: knexAddon.category,
    });

    return domainAddon;
  }

  public static toDomainEntities(knexAddons: AddonModel[]): Addon[] {
    return knexAddons.map((knexAddon) => this.toDomainEntity(knexAddon));
  }
}
