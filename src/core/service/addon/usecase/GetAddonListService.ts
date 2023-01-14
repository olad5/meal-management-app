import { AddonRepositoryPort } from "../../../domain/addon/port/persistence/AddonRepositoryPort";
import { GetAddonListPort } from "../../../domain/addon/port/usecase/GetAddonListPort";
import { GetAddonListUseCase } from "../../../domain/addon/usecase/GetAddonListUseCase";
import { AddonUseCaseDto } from "../../../domain/addon/usecase/dto/AddonUseCaseDto";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { Code } from "../../../common/code/Code";
import { Exception } from "../../../common/exception/Exception";

export class GetAddonListService implements GetAddonListUseCase {
  constructor(private readonly addonRepository: AddonRepositoryPort) {}

  public async execute(payload: GetAddonListPort): Promise<AddonUseCaseDto[]> {
    const doesBrandExist = await this.addonRepository.doesBrandExist(
      payload.brandId,
    );

    CoreAssert.isFalse(
      !doesBrandExist,
      Exception.new({
        code: Code.NOT_FOUND_ERROR,
        overrideMessage: "Brand Not Found.",
      }),
    );
    const addons = await this.addonRepository.findAddonsByBrandId(
      payload.brandId,
    );

    return AddonUseCaseDto.newListFromAddons(addons);
  }
}
