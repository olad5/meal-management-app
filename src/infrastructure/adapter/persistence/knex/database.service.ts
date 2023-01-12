import { Module } from "@nestjs/common";
import Knex from "knex";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import knexfile from "./knexfile";

@Module({
  imports: [
    ObjectionModule.register({
      config: knexfile,
    }),
  ],
  exports: [ObjectionModule],
})
export class DatabaseService {
  private _knexConnection: ReturnType<typeof Knex>;

  constructor() {
    this._knexConnection = Knex({
      ...knexfile,
    });
  }

  public getInstance(): ReturnType<typeof Knex> {
    return this._knexConnection;
  }
  public closeConnection(): void {
    this._knexConnection.destroy();
  }
}
