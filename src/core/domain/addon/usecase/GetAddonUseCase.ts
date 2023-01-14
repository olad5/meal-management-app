import { UseCase } from "../../../common/usecase/UseCase";
import { GetAddonPort } from "../port/usecase/GetAddonPort";
import { AddonUseCaseDto } from "./dto/AddonUseCaseDto";

export type GetAddonUseCase = UseCase<GetAddonPort, AddonUseCaseDto>;
