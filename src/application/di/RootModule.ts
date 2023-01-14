import { Module } from "@nestjs/common";
import { AuthModule } from "./AuthModule";
import { BrandModule } from "./BrandModule";
import { InfrastructureModule } from "./InfrastructureModule";
import { UserModule } from "./UserModule";
@Module({
  imports: [UserModule, AuthModule, BrandModule, InfrastructureModule],
})
export class RootModule {}
