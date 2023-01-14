import { Inject } from "@nestjs/common";
import { Optional } from "../../../../../../core/common/type/CommonTypes";
import { Addon } from "../../../../../../core/domain/addon/entity/Addon";
import { AddonRepositoryPort } from "../../../../../../core/domain/addon/port/persistence/AddonRepositoryPort";
import { BrandRepositoryPort } from "../../../../../../core/domain/brand/port/persistence/BrandRepositoryPort";
import { ObjectionAddonMapper } from "../../entity/addon/mapper/ObjectionAddonMapper";
import { AddonModel } from "../../models/addon.model";
import { ObjectionBrandRepositoryAdapter } from "../brand/ObjectionBrandRepositoryAdapter";

export class ObjectionAddonRepositoryAdapter implements AddonRepositoryPort {
  constructor(
    @Inject(AddonModel) private readonly addonModel: typeof AddonModel,
    @Inject(ObjectionBrandRepositoryAdapter)
    private readonly brandRepo: BrandRepositoryPort,
  ) {}

  async createAddon(addon: Addon): Promise<void> {
    const objectionAddon = ObjectionAddonMapper.toPersistence(addon);

    await this.addonModel.query().insert({
      ...objectionAddon,
    });
  }

  async findAddonByAddonId(id: string): Promise<Addon> {
    const queryResult = await this.addonModel.query().select().where("id ", id);
    const addon = queryResult[0];
    if (queryResult.length < 1) {
      return undefined;
    }
    const domainEntity: Optional<Addon> =
      ObjectionAddonMapper.toDomainEntity(addon);
    return domainEntity;
  }

  async findAddonByAddonName(name: string): Promise<Addon> {
    const queryResult = await this.addonModel
      .query()
      .select()
      .where("name", name.toLowerCase());
    if (queryResult.length < 1) {
      return undefined;
    }
    const addon = queryResult[0];
    const domainEntity: Optional<Addon> =
      ObjectionAddonMapper.toDomainEntity(addon);
    return domainEntity;
  }

  async doesBrandExist(brandId: string): Promise<boolean> {
    const brand = await this.brandRepo.findBrandByBrandId(brandId);
    if (!brand) {
      return false;
    } else {
      return true;
    }
  }

  async findAddonsByBrandId(brandId: string): Promise<Addon[]> {
    const queryResult = await this.addonModel
      .query()
      .select()
      .where("brand_id ", brandId);
    return ObjectionAddonMapper.toDomainEntities(queryResult);
  }
}
