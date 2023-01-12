import { Module, Provider } from "@nestjs/common";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { BrandDITokens } from "../../core/domain/brand/di/BrandDITokens";
import { BrandRepositoryPort } from "../../core/domain/brand/port/persistence/BrandRepositoryPort";
import { CreateBrandService } from "../../core/service/brand/usecase/CreateBrandService";
import { DatabaseService } from "../../infrastructure/adapter/persistence/knex/database.service";
import { BrandModel } from "../../infrastructure/adapter/persistence/knex/models/brand.model";
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
];
const useCaseProviders: Provider[] = [
  {
    provide: BrandDITokens.CreateBrandUseCase,
    useFactory: (brandRepository: BrandRepositoryPort) =>
      new CreateBrandService(brandRepository),
    inject: [BrandDITokens.BrandRepository],
  },
];
@Module({
  controllers: [BrandController],
  providers: [...useCaseProviders, ...persistenceProviders],
  exports: [BrandDITokens.BrandRepository],
  imports: [
    InfrastructureModule,
    DatabaseService,
    ObjectionModule.forFeature([BrandModel]),
  ],
})
export class BrandModule {}
