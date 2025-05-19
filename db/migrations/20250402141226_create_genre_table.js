/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.createTable('genre', (table) => {
        table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').notNullable();
        table.string('description');
        table.string('created_by').references('id').inTable('user').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
    await knex.schema.alterTable('community', (table) => {
        table.string('genre_id').notNullable().references('id').inTable('genre').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
