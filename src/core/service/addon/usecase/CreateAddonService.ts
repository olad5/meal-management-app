import { Code } from "../../../common/code/Code";
import { Exception } from "../../../common/exception/Exception";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { Addon } from "../../../domain/addon/entity/Addon";
import { AddonRepositoryPort } from "../../../domain/addon/port/persistence/AddonRepositoryPort";
import { CreateAddonPort } from "../../../domain/addon/port/usecase/CreateAddonPort";
import { CreateAddonUseCase } from "../../../domain/addon/usecase/CreateAddonUseCase";
import { AddonUseCaseDto } from "../../../domain/addon/usecase/dto/AddonUseCaseDto";

export class CreateAddonService implements CreateAddonUseCase {
  constructor(private readonly addonRepository: AddonRepositoryPort) {}

  public async execute(payload: CreateAddonPort): Promise<AddonUseCaseDto> {
    const doesBrandExist = await this.addonRepository.doesBrandExist(
      payload.brandId,
    );
    CoreAssert.isFalse(
      !doesBrandExist,
      Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: "Can not created addon, Brand does not exist.",
      }),
    );
    const doesAddonExist = !!(await this.addonRepository.findAddonByAddonName(
      payload.name,
    ));

    CoreAssert.isFalse(
      doesAddonExist,
      Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: "Addon already exists.",
      }),
    );
    const isAddonPriceNegative: boolean = payload.price < 0;
    CoreAssert.isFalse(
      isAddonPriceNegative,
      Exception.new({
        code: Code.ACCESS_DENIED_ERROR,
        overrideMessage: "Addon Price cannot be negative.",
      }),
    );

    const addon: Addon = await Addon.new({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      brandId: payload.brandId,
      category: payload.category,
    });

    await this.addonRepository.createAddon(addon);

    return AddonUseCaseDto.newFromAddon(addon);
  }
}
