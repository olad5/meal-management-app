import { UseCase } from "../../../common/usecase/UseCase";
import { GetAddonListPort } from "../port/usecase/GetAddonListPort";
import { AddonUseCaseDto } from "./dto/AddonUseCaseDto";

export type GetAddonListUseCase = UseCase<GetAddonListPort, AddonUseCaseDto[]>;
