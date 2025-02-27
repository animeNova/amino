/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.alterTable('session', (table) => {
        table.text('userAgent').alter()
    })
    await knex.schema.alterTable('account', (table) => {
        table.text('scope').alter()
    })
    await knex.schema.alterTable('verification', (table) => {
        table.text('value').alter()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
