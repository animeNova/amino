/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    return knex.schema

    // Create reports table
    .createTable('reports', (table) => {
      table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('reporter_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      table.string('reported_user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      table.string('report_type').notNullable();
      table.text('description').notNullable();
      table.enum('status', ['pending', 'resolved', 'dismissed']).defaultTo('pending').notNullable();
      table.string('resolved_by').references('id').inTable('user').onDelete('CASCADE');
      table.timestamp('resolved_at');
      table.string('community_id').notNullable().references('id').inTable('community').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('user_levels')
};
