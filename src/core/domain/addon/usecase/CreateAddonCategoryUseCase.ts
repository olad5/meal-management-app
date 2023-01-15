import { UseCase } from "../../../common/usecase/UseCase";
import { CreateAdddonCategoryPort } from "../port/usecase/CreateAdddonCategoryPort";
import { AddonCategoryUseCaseDto } from "./dto/AddonCategoryUseCaseDto";

export type CreateAddonCategoryUseCase = UseCase<
  CreateAdddonCategoryPort,
  AddonCategoryUseCaseDto
>;
