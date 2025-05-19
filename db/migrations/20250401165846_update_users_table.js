/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.alterTable('user', (table) => {
    table.dropColumns(['banned', 'banReason', 'banExpires', 'impersonatedBy','role']);

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {

};
