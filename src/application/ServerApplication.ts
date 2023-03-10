import { INestApplication } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ApiServerConfig } from "../infrastructure/config/ApiServerConfig";
import { RootModule } from "./di/RootModule";

let app: INestApplication;

export const initializeWebServer = async (
  serverPort?: number,
): Promise<{ port: number }> => {
  app = await NestFactory.create(RootModule);

  const port = serverPort || ApiServerConfig.PORT;
  await app.listen(port, () =>
    Logger.log(`\n\nServer running at http://localhost:${port}\n`),
  );

  return app.getHttpServer().address();
};

export const stopWebServer = async (): Promise<void> => {
  return await app.close();
};
