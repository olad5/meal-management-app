import { Module, Provider } from "@nestjs/common";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { UserDITokens } from "../../core/domain/user/di/UserDITokens";
import { UserRepositoryPort } from "../../core/domain/user/port/persistence/UserRepositoryPort";
import { CreateUserService } from "../../core/service/user/usecase/CreateUserService";
import { DatabaseService } from "../../infrastructure/adapter/persistence/knex/database.service";
import { UserModel } from "../../infrastructure/adapter/persistence/knex/models/user.model";
import { ObjectionUserRepositoryAdapter } from "../../infrastructure/adapter/persistence/knex/repository/user/ObjectionUserRepositoryAdapter";
import { UserController } from "../api/http-rest/controller/UserController";
import { InfrastructureModule } from "./InfrastructureModule";

const persistenceProviders: Provider[] = [
  {
    provide: UserDITokens.UserRepository,
    useFactory: (databaseService: typeof UserModel) => {
      const objectionUserRepository = new ObjectionUserRepositoryAdapter(
        databaseService,
      );
      return objectionUserRepository;
    },
    inject: [UserModel],
  },
];
const useCaseProviders: Provider[] = [
  {
    provide: UserDITokens.CreateUserUseCase,
    useFactory: (userRepository: UserRepositoryPort) =>
      new CreateUserService(userRepository),
    inject: [UserDITokens.UserRepository],
  },
];
@Module({
  controllers: [UserController],
  providers: [...useCaseProviders, ...persistenceProviders],
  exports: [UserDITokens.UserRepository],
  imports: [
    InfrastructureModule,
    DatabaseService,
    ObjectionModule.forFeature([UserModel]),
  ],
})
export class UserModule {}
