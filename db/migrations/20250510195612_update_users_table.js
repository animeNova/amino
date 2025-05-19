/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.alterTable('user',(table)=>{
    table.boolean('is_new').defaultTo(true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
  await knex.schema.alterTable('user',(table)=>{
    table.dropColumn('is_new')
  })
};
