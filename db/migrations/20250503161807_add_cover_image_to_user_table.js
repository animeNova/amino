/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.alterTable('user', (table) => {
      table.string('coverImage').nullable();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down =async function(knex) {
      await knex.schema.alterTable('user', (table) => {
          table.dropColumn('coverImage');
      });
  };
  