import { Code } from "../../../common/code/Code";
import { Exception } from "../../../common/exception/Exception";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { Addon } from "../../../domain/addon/entity/Addon";
import { AddonRepositoryPort } from "../../../domain/addon/port/persistence/AddonRepositoryPort";
import { UpdateAddonPort } from "../../../domain/addon/port/usecase/UpdateAddonPort";
import { UpdateAddonUseCase } from "../../../domain/addon/usecase/UpdateAddonUseCase";
import { AddonUseCaseDto } from "../../../domain/addon/usecase/dto/AddonUseCaseDto";

export class UpdateAddonService implements UpdateAddonUseCase {
  constructor(private readonly addonRepository: AddonRepositoryPort) {}

  public async execute(payload: UpdateAddonPort): Promise<AddonUseCaseDto> {
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
    const existingAddon: Addon = await this.addonRepository.findAddonByAddonId(
      payload.addonId,
    );
    const addonNotFound = !!!existingAddon;

    CoreAssert.isFalse(
      addonNotFound,
      Exception.new({
        code: Code.NOT_FOUND_ERROR,
        overrideMessage: "Addon does not exist.",
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
      id: payload.addonId || existingAddon.getId(),
      name: payload.name || existingAddon.getAddonName(),
      description: payload.description || existingAddon.getDescription(),
      price: payload.price || existingAddon.getPrice(),
      brandId: payload.brandId,
      category: payload.category || existingAddon.getCategory(),
    });

    await this.addonRepository.updateAddon(addon);

    return AddonUseCaseDto.newFromAddon(addon);
  }
}
