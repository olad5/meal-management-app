import { Code } from "../../../common/code/Code";
import { Exception } from "../../../common/exception/Exception";
import { CoreAssert } from "../../../common/util/assert/CoreAssert";
import { Addon } from "../../../domain/addon/entity/Addon";
import { AddonRepositoryPort } from "../../../domain/addon/port/persistence/AddonRepositoryPort";
import { DeleteAddonPort } from "../../../domain/addon/port/usecase/DeleteAddonPort";
import { DeleteAddonUseCase } from "../../../domain/addon/usecase/DeleteAddonUseCase";

export class DeleteAddonService implements DeleteAddonUseCase {
  constructor(private readonly addonRepository: AddonRepositoryPort) {}

  public async execute(payload: DeleteAddonPort): Promise<void> {
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

    await this.addonRepository.deleteAddon(existingAddon);
  }
}
