/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    return knex.schema
    // Create users table
    
    // Create user_activities table
    .createTable('user_activities', (table) => {
      table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      table.string('activity_type').notNullable();
      table.integer('points').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    })
    
    // Create level_definitions table
    .createTable('level_definitions', (table) => {
      table.integer('level').primary();
      table.integer('points_required').notNullable();
      table.string('title');
      table.string('badge_url');
      table.string('benefits');
    })
    
    // Create user_levels table
    .createTable('user_levels', (table) => {
      table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      table.integer('level').notNullable().defaultTo(1);
      table.integer('current_points').notNullable().defaultTo(0);
      table.integer('points_to_next_level').notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('user_levels')
    .dropTableIfExists('level_definitions')
    .dropTableIfExists('user_activities')
};
