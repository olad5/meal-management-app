import { Knex } from "knex";

const tableName = "addon";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable(tableName, (table) => {
    table.uuid("id").notNullable().unique().primary();
    table.string("name", 250).notNullable().unique();
    table.string("description", 250).notNullable();
    table.float("price").notNullable();
    table.uuid("brand_id").notNullable();
    table.string("category").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(tableName);
}
