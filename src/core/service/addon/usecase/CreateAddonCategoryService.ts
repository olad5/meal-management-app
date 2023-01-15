import { Code } from "../../../common/code/Code";
import { Exception } from "../../../common/exception/Exception";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { AddonCategory } from "../../../domain/addon/entity/AddonCategory";
import { AddonCategoryRepositoryPort } from "../../../domain/addon/port/persistence/AddonCategoryRepositoryPort";
import { CreateAdddonCategoryPort } from "../../../domain/addon/port/usecase/CreateAdddonCategoryPort";
import { CreateAddonCategoryUseCase } from "../../../domain/addon/usecase/CreateAddonCategoryUseCase";
import { AddonCategoryUseCaseDto } from "../../../domain/addon/usecase/dto/AddonCategoryUseCaseDto";

export class CreateAddonCategoryService implements CreateAddonCategoryUseCase {
  constructor(
    private readonly addonCategoryRepository: AddonCategoryRepositoryPort,
  ) {}

  public async execute(
    payload: CreateAdddonCategoryPort,
  ): Promise<AddonCategoryUseCaseDto> {
    const doesAddonCategoryExist =
      await this.addonCategoryRepository.findAddonCategoryByName(payload.name);

    CoreAssert.isFalse(
      !!doesAddonCategoryExist,
      Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: "AddonCategory already exists.",
      }),
    );

    const addonCategory: AddonCategory = await AddonCategory.new({
      name: payload.name,
      brandId: payload.brandId,
    });

    await this.addonCategoryRepository.createAddonCategory(addonCategory);

    return AddonCategoryUseCaseDto.newFromAddonCategory(addonCategory);
  }
}
