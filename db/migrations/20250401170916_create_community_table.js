/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.createTable('community', (table) => {
        table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').notNullable();
        table.string('handle').notNullable();
        table.string('description').notNullable();
        table.string('image').notNullable();
        table.string('backgroundImage').notNullable();
        table.string('language').notNullable();
        table.enum('visibility',['public','private','request_only']).defaultTo('public').notNullable();
        table.string('created_by').unsigned().references('id').inTable('user').onDelete('CASCADE');
        table.timestamps(true, true);
    }); 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
