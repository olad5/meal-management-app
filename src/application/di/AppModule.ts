import { Module } from "@nestjs/common";
import { AppController } from "../api/http-rest/controller/AppController";

@Module({
  controllers: [AppController],
})
export class AppModule {}
