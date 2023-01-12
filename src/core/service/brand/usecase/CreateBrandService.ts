import { Code } from "../../../common/code/Code";
import { Exception } from "../../../common/exception/Exception";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { Brand } from "../../../domain/brand/entity/Brand";
import { BrandRepositoryPort } from "../../../domain/brand/port/persistence/BrandRepositoryPort";
import { CreateBrandPort } from "../../../domain/brand/port/usecase/CreateBrandPort";
import { CreateBrandUseCase } from "../../../domain/brand/usecase/CreateBrandUseCase";
import { BrandUseCaseDto } from "../../../domain/brand/usecase/dto/BrandUseCaseDto";

export class CreateBrandService implements CreateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepositoryPort) {}

  public async execute(payload: CreateBrandPort): Promise<BrandUseCaseDto> {
    const doesBrandExist = !!(await this.brandRepository.findBrandByBrandName(
      payload.name,
    ));
    CoreAssert.isFalse(
      doesBrandExist,
      Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: "Brand already exists.",
      }),
    );

    const brand: Brand = await Brand.new({
      name: payload.name,
    });

    await this.brandRepository.createBrand(brand);

    return BrandUseCaseDto.newFromBrand(brand);
  }
}
