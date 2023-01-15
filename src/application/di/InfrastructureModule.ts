import { Global, Module, Provider } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ApiServerConfig } from "../../infrastructure/config/ApiServerConfig";
import { NestHttpExceptionFilter } from "../api/http-rest/exception-filter/NestHttpExceptionFilter";
import { DatabaseService } from "../../infrastructure/adapter/persistence/knex/database.service";
import { NestHttpLoggingInterceptor } from "../api/http-rest/interceptor/NestHttpLoggingInterceptor";
const providers: Provider[] = [
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
export class InfrastructureModule {}
