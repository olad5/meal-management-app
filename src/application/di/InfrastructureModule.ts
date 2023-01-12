import {
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ApiServerConfig } from "../../infrastructure/config/ApiServerConfig";
import { NestHttpExceptionFilter } from "../api/http-rest/exception-filter/NestHttpExceptionFilter";
import { DatabaseService } from "../../infrastructure/adapter/persistence/knex/database.service";
import { BaseModel } from "../../infrastructure/adapter/persistence/knex/models/base.model";
import { UserModel } from "../../infrastructure/adapter/persistence/knex/models/user.model";
import { NestHttpLoggingInterceptor } from "../api/http-rest/interceptor/NestHttpLoggingInterceptor";
const models: (typeof BaseModel)[] = [UserModel];
const modelProviders: Provider[] = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers: Provider[] = [
  ...modelProviders,
  {
    provide: APP_FILTER,
    useClass: NestHttpExceptionFilter,
  },
];

if (ApiServerConfig.LOG_ENABLE) {
  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: NestHttpLoggingInterceptor,
  });
}

@Global()
@Module({
  providers: [DatabaseService, ...providers],
  exports: [DatabaseService],
})
export class InfrastructureModule implements OnApplicationShutdown {
  constructor(private readonly databaseService: DatabaseService) {}
  onApplicationShutdown(_: string): void {
    this.databaseService.closeConnection();
  }
}
