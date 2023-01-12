import { Module } from "@nestjs/common";
import { InfrastructureModule } from "./InfrastructureModule";
import { UserModule } from "./UserModule";
@Module({
  imports: [UserModule, InfrastructureModule],
})
export class RootModule {}
