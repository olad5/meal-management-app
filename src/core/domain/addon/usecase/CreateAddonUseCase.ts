import { UseCase } from "../../../common/usecase/UseCase";
import { CreateAddonPort } from "../port/usecase/CreateAddonPort";
import { AddonUseCaseDto } from "./dto/AddonUseCaseDto";

export type CreateAddonUseCase = UseCase<CreateAddonPort, AddonUseCaseDto>;
