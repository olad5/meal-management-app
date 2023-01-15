import { Module } from "@nestjs/common";
import { AppModule } from "./AppModule";
import { AuthModule } from "./AuthModule";
import { BrandModule } from "./BrandModule";
import { InfrastructureModule } from "./InfrastructureModule";
import { UserModule } from "./UserModule";
@Module({
  imports: [
    AppModule,
    UserModule,
    AuthModule,
    BrandModule,
    InfrastructureModule,
  ],
})
export class RootModule {}
