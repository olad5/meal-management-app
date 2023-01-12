import { UseCase } from "../../../common/usecase/UseCase";
import { CreateBrandPort } from "../port/usecase/CreateBrandPort";
import { BrandUseCaseDto } from "./dto/BrandUseCaseDto";

export type CreateBrandUseCase = UseCase<CreateBrandPort, BrandUseCaseDto>;
