import { AddonRepositoryPort } from "../../../domain/addon/port/persistence/AddonRepositoryPort";
import { GetAddonPort } from "../../../domain/addon/port/usecase/GetAddonPort";
import { GetAddonUseCase } from "../../../domain/addon/usecase/GetAddonUseCase";
import { AddonUseCaseDto } from "../../../domain/addon/usecase/dto/AddonUseCaseDto";
import { Code } from "../../../common/code/Code";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { Exception } from "../../../common/exception/Exception";

export class GetAddonService implements GetAddonUseCase {
  constructor(private readonly addonRepository: AddonRepositoryPort) {}

  public async execute(payload: GetAddonPort): Promise<AddonUseCaseDto> {
    const addon = await this.addonRepository.findAddonByAddonId(
      payload.addonId,
    );

    const doesAddonExist = !addon;

    CoreAssert.isFalse(
      doesAddonExist,
      Exception.new({
        code: Code.NOT_FOUND_ERROR,
        overrideMessage: "Addon does not exist.",
      }),
    );

    return AddonUseCaseDto.newFromAddon(addon);
  }
}
