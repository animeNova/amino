/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('followers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('follower_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
    table.string('following_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Constraint to prevent a user from following themselves
    table.check('follower_id <> following_id');

    // Unique constraint to prevent duplicate follow relationships
    table.unique(['follower_id', 'following_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('followers');
};
