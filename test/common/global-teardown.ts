import isCI from "is-ci";
import dockerCompose from "docker-compose";
import { DatabaseService } from "../../src/infrastructure/adapter/persistence/knex/database.service";
import { Logger } from "@nestjs/common";

const tableNames: string[] = ["user", "brand", "addon", "category"];

module.exports = async () => {
  if (isCI) {
    dockerCompose.down();
  } else {
    /* eslint-disable */
    console.time("global-teardown");
    /* eslint-enable */
    if (Math.ceil(Math.random() * 10) === 10) {
      const databaseService = new DatabaseService();
      const dbInstance = databaseService.getInstance();
      for (const table of tableNames) {
        await dbInstance(table).truncate();
      }

      databaseService.closeConnection();
      Logger.log("done truncating the db");
    }
    /* eslint-disable */
    console.timeEnd("global-teardown");
    /* eslint-enable */
  }
};
