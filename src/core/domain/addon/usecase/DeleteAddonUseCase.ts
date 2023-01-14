import { UseCase } from "../../../common/usecase/UseCase";
import { DeleteAddonPort } from "../port/usecase/DeleteAddonPort";

export type DeleteAddonUseCase = UseCase<DeleteAddonPort, void>;
