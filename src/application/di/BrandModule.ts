import { Module, Provider } from "@nestjs/common";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { AddonRepositoryPort } from "../../core/domain/addon/port/persistence/AddonRepositoryPort";
import { BrandDITokens } from "../../core/domain/brand/di/BrandDITokens";
import { BrandRepositoryPort } from "../../core/domain/brand/port/persistence/BrandRepositoryPort";
import { CreateAddonService } from "../../core/service/addon/usecase/CreateAddonService";
import { GetAddonListService } from "../../core/service/addon/usecase/GetAddonListService";
import { GetAddonService } from "../../core/service/addon/usecase/GetAddonService";
import { UpdateAddonService } from "../../core/service/addon/usecase/UpdateAddonService";
import { CreateBrandService } from "../../core/service/brand/usecase/CreateBrandService";
import { DatabaseService } from "../../infrastructure/adapter/persistence/knex/database.service";
import { AddonModel } from "../../infrastructure/adapter/persistence/knex/models/addon.model";
import { BrandModel } from "../../infrastructure/adapter/persistence/knex/models/brand.model";
import { ObjectionAddonRepositoryAdapter } from "../../infrastructure/adapter/persistence/knex/repository/addon/ObjectionAddonRepositoryAdapter";
import { ObjectionBrandRepositoryAdapter } from "../../infrastructure/adapter/persistence/knex/repository/brand/ObjectionBrandRepositoryAdapter";
import { BrandController } from "../api/http-rest/controller/BrandController";
import { InfrastructureModule } from "./InfrastructureModule";

const persistenceProviders: Provider[] = [
  {
    provide: BrandDITokens.BrandRepository,
    useFactory: (databaseService: typeof BrandModel) => {
      const objectionBrandRepository = new ObjectionBrandRepositoryAdapter(
        databaseService,
      );
      return objectionBrandRepository;
    },
    inject: [BrandModel],
  },
  {
    provide: BrandDITokens.AddonRepository,
    useFactory: (
      databaseService: typeof AddonModel,
      brandRepo: BrandRepositoryPort,
    ) => {
      const objectionAddonRepository = new ObjectionAddonRepositoryAdapter(
        databaseService,
        brandRepo,
      );
      return objectionAddonRepository;
    },
    inject: [AddonModel, BrandDITokens.BrandRepository],
  },
];
const useCaseProviders: Provider[] = [
  {
    provide: BrandDITokens.CreateBrandUseCase,
    useFactory: (brandRepository: BrandRepositoryPort) =>
      new CreateBrandService(brandRepository),
    inject: [BrandDITokens.BrandRepository],
  },
  {
    provide: BrandDITokens.CreateAddonUseCase,
    useFactory: (addonRepository: AddonRepositoryPort) =>
      new CreateAddonService(addonRepository),
    inject: [BrandDITokens.AddonRepository],
  },
  {
    provide: BrandDITokens.GetAddonListUseCase,
    useFactory: (addonRepository: AddonRepositoryPort) =>
      new GetAddonListService(addonRepository),
    inject: [BrandDITokens.AddonRepository],
  },
  {
    provide: BrandDITokens.GetAddonUseCase,
    useFactory: (addonRepository: AddonRepositoryPort) =>
      new GetAddonService(addonRepository),
    inject: [BrandDITokens.AddonRepository],
  },
  {
    provide: BrandDITokens.UpdateAddonUseCase,
    useFactory: (addonRepository: AddonRepositoryPort) =>
      new UpdateAddonService(addonRepository),
    inject: [BrandDITokens.AddonRepository],
  },
];
@Module({
  controllers: [BrandController],
  providers: [...useCaseProviders, ...persistenceProviders],
  exports: [BrandDITokens.BrandRepository, BrandDITokens.AddonRepository],
  imports: [
    InfrastructureModule,
    DatabaseService,
    ObjectionModule.forFeature([BrandModel, AddonModel]),
  ],
})
export class BrandModule {}
