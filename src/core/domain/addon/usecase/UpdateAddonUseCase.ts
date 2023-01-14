import { UseCase } from "../../../common/usecase/UseCase";
import { UpdateAddonPort } from "../port/usecase/UpdateAddonPort";
import { AddonUseCaseDto } from "./dto/AddonUseCaseDto";

export type UpdateAddonUseCase = UseCase<UpdateAddonPort, AddonUseCaseDto>;
