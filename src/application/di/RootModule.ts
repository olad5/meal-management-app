import { Module } from "@nestjs/common";
import { BrandModule } from "./BrandModule";
import { InfrastructureModule } from "./InfrastructureModule";
import { UserModule } from "./UserModule";
@Module({
  imports: [UserModule, BrandModule, InfrastructureModule],
})
export class RootModule {}
