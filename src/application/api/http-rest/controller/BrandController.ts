import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CoreApiResponse } from "../../../../core/common/api/CoreApiResponse";
import { BrandDITokens } from "../../../../core/domain/brand/di/BrandDITokens";
import { BrandUseCaseDto } from "../../../../core/domain/brand/usecase/dto/BrandUseCaseDto";
import { CreateBrandUseCase } from "../../../../core/domain/brand/usecase/CreateBrandUseCase";
import { CreateBrandAdapter } from "../../../../infrastructure/adapter/usecase/brand/CreateBrandAdapter";
import { HttpRestApiCreateBrandBody } from "./request/brand/HttpRestApiCreateBrandBody";
import { CreateAddonAdapter } from "../../../../infrastructure/adapter/usecase/addon/CreateAddonAdapter";
import { HttpRestApiCreateAddonBody } from "./request/brand/HttpRestApiCreateAddonBody";
import { AddonUseCaseDto } from "../../../../core/domain/addon/usecase/dto/AddonUseCaseDto";
import { CreateAddonUseCase } from "../../../../core/domain/addon/usecase/CreateAddonUseCase";
import { HttpAuth } from "../auth/decorator/HttpAuth";
import { UserRole } from "../../../../core/common/enums/UserEnums";
import { GetAddonListAdapter } from "../../../../infrastructure/adapter/usecase/addon/GetAddonListAdapter";
import { GetAddonListUseCase } from "../../../../core/domain/addon/usecase/GetAddonListUseCase";
import { GetAddonAdapter } from "../../../../infrastructure/adapter/usecase/addon/GetAddonAdapter";
import { GetAddonUseCase } from "../../../../core/domain/addon/usecase/GetAddonUseCase";
import { UpdateAddonAdapter } from "../../../../infrastructure/adapter/usecase/addon/UpdateAddonAdapter";
import { UpdateAddonUseCase } from "../../../../core/domain/addon/usecase/UpdateAddonUseCase";
import { DeleteAddonAdapter } from "../../../../infrastructure/adapter/usecase/addon/DeleteAddonAdapter";
import { DeleteAddonUseCase } from "../../../../core/domain/addon/usecase/DeleteAddonUseCase";

@Controller("brands")
export class BrandController {
  constructor(
    @Inject(BrandDITokens.CreateBrandUseCase)
    private readonly createBrandUseCase: CreateBrandUseCase,
    @Inject(BrandDITokens.CreateAddonUseCase)
    private readonly createAddonUseCase: CreateAddonUseCase,
    @Inject(BrandDITokens.GetAddonListUseCase)
    private readonly getAddonListUseCase: GetAddonListUseCase,
    @Inject(BrandDITokens.GetAddonUseCase)
    private readonly getAddonUseCase: GetAddonUseCase,
    @Inject(BrandDITokens.UpdateAddonUseCase)
    private readonly updateAddonUseCase: UpdateAddonUseCase,

    @Inject(BrandDITokens.DeleteAddonUseCase)
    private readonly deleteAddonUseCase: DeleteAddonUseCase,
  ) {}

  @HttpAuth(UserRole.ADMIN)
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
  @HttpAuth(UserRole.ADMIN)
  @Post("/:brandId/addons")
  @HttpCode(HttpStatus.OK)
  public async createAddon(
    @Body() body: HttpRestApiCreateAddonBody,
    @Param("brandId") brandId: string,
  ): Promise<CoreApiResponse<AddonUseCaseDto>> {
    const adapter: CreateAddonAdapter = await CreateAddonAdapter.new({
      name: body.name,
      description: body.description || "",
      price: body.price,
      category: body.category || "",
      brandId,
    });

    const createdAddon: AddonUseCaseDto = await this.createAddonUseCase.execute(
      adapter,
    );

    return CoreApiResponse.success<AddonUseCaseDto>(createdAddon);
  }
  @HttpAuth(UserRole.ADMIN)
  @Get("/:brandId/addons")
  @HttpCode(HttpStatus.OK)
  public async getAddonList(
    @Param("brandId") brandId: string,
  ): Promise<CoreApiResponse<AddonUseCaseDto[]>> {
    const adapter: GetAddonListAdapter = await GetAddonListAdapter.new({
      brandId,
    });
    const createdAddons: AddonUseCaseDto[] =
      await this.getAddonListUseCase.execute(adapter);

    return CoreApiResponse.success<AddonUseCaseDto[]>(createdAddons);
  }
  @HttpAuth(UserRole.ADMIN)
  @Get("/:brandId/addons/:addonId")
  @HttpCode(HttpStatus.OK)
  public async getAddon(
    @Param("brandId") brandId: string,
    @Param("addonId") addonId: string,
  ): Promise<CoreApiResponse<AddonUseCaseDto>> {
    const adapter: GetAddonAdapter = await GetAddonAdapter.new({
      brandId,
      addonId,
    });

    const addon: AddonUseCaseDto = await this.getAddonUseCase.execute(adapter);

    return CoreApiResponse.success<AddonUseCaseDto>(addon);
  }
  @HttpAuth(UserRole.ADMIN)
  @Patch("/:brandId/addons/:addonId")
  @HttpCode(HttpStatus.OK)
  public async updateAddon(
    @Body() body: HttpRestApiCreateAddonBody,
    @Param("brandId") brandId: string,
    @Param("addonId") addonId: string,
  ): Promise<CoreApiResponse<AddonUseCaseDto>> {
    const adapter: UpdateAddonAdapter = await UpdateAddonAdapter.new({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      addonId,
      brandId,
    });

    const addon: AddonUseCaseDto = await this.updateAddonUseCase.execute(
      adapter,
    );

    return CoreApiResponse.success<AddonUseCaseDto>(addon);
  }
  @HttpAuth(UserRole.ADMIN)
  @Delete("/:brandId/addons/:addonId")
  @HttpCode(HttpStatus.OK)
  public async deleteAddon(
    @Param("brandId") brandId: string,
    @Param("addonId") addonId: string,
  ): Promise<CoreApiResponse<AddonUseCaseDto>> {
    const adapter: DeleteAddonAdapter = await DeleteAddonAdapter.new({
      addonId,
      brandId,
    });

    await this.deleteAddonUseCase.execute(adapter);

    return CoreApiResponse.success();
  }
}
