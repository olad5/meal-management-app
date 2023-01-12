import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from "@nestjs/common";
import { CoreApiResponse } from "../../../../core/common/api/CoreApiResponse";
import { BrandDITokens } from "../../../../core/domain/brand/di/BrandDITokens";
import { BrandUseCaseDto } from "../../../../core/domain/brand/usecase/dto/BrandUseCaseDto";
import { CreateBrandUseCase } from "../../../../core/domain/brand/usecase/CreateBrandUseCase";
import { CreateBrandAdapter } from "../../../../infrastructure/adapter/usecase/brand/CreateBrandAdapter";
import { HttpRestApiCreateBrandBody } from "./request/brand/HttpRestApiCreateBrandBody";

@Controller("brands")
export class BrandController {
  constructor(
    @Inject(BrandDITokens.CreateBrandUseCase)
    private readonly createBrandUseCase: CreateBrandUseCase,
  ) {}

  @Post("")
  @HttpCode(HttpStatus.OK)
  public async createBrand(
    @Body() body: HttpRestApiCreateBrandBody,
  ): Promise<CoreApiResponse<BrandUseCaseDto>> {
    const adapter: CreateBrandAdapter = await CreateBrandAdapter.new({
      name: body.name.toLowerCase(),
    });

    const createdBrand: BrandUseCaseDto = await this.createBrandUseCase.execute(
      adapter,
    );

    return CoreApiResponse.success<BrandUseCaseDto>(createdBrand);
  }
}
