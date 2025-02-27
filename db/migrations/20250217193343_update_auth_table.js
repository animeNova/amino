/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.alterTable('session', (table) => {
        table.text('token').alter()
    })
    await knex.schema.alterTable('account', (table) => {
        table.text('idToken').alter()
        table.text('accessToken').alter()
        table.text('refreshToken').alter()
    })
    await knex.schema.alterTable('verification', (table) => {
        table.text('identifier').alter()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
