import { Inject } from "@nestjs/common";
import { Optional } from "../../../../../../core/common/type/CommonTypes";
import { Brand } from "../../../../../../core/domain/brand/entity/Brand";
import { BrandRepositoryPort } from "../../../../../../core/domain/brand/port/persistence/BrandRepositoryPort";
import { ObjectionBrandMapper } from "../../entity/brand/mapper/ObjectionBrandMapper";
import { BrandModel } from "../../models/brand.model";

export class ObjectionBrandRepositoryAdapter implements BrandRepositoryPort {
  constructor(
    @Inject(BrandModel) private readonly brandModel: typeof BrandModel,
  ) {}

  async createBrand(brand: Brand): Promise<void> {
    const objectionBrand = ObjectionBrandMapper.toPersistence(brand);

    await this.brandModel.query().insert({
      ...objectionBrand,
    });
  }

  async findBrandByBrandId(brandId: string): Promise<Brand> {
    const queryResult = await this.brandModel
      .query()
      .select()
      .where("id ", brandId);
    const brand = queryResult[0];
    if (queryResult.length < 1) {
      return undefined;
    }
    const domainEntity: Optional<Brand> =
      ObjectionBrandMapper.toDomainEntity(brand);
    return domainEntity;
  }

  async findBrandByBrandName(brandName: string): Promise<Brand> {
    const queryResult = await this.brandModel
      .query()
      .select()
      .where("name", brandName);
    const brand = queryResult[0];
    if (queryResult.length < 1) {
      return undefined;
    }
    const domainEntity: Optional<Brand> =
      ObjectionBrandMapper.toDomainEntity(brand);
    return domainEntity;
  }
}
