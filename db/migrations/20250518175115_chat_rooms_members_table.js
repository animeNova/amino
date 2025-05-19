/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('chat_room_members', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Relationships
    table.uuid('room_id').references('id').inTable('chat_rooms').onDelete('CASCADE').notNullable();
    table.string('user_id').references('id').inTable('user').onDelete('CASCADE').notNullable();
    
    // Member information
    table.string('role').defaultTo('member'); // member, moderator
    table.boolean('is_muted').defaultTo(false);
    
    // Timestamps
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.timestamp('last_read_at').defaultTo(knex.fn.now());
    
    // Unique constraint to prevent duplicate memberships
    table.unique(['room_id', 'user_id']);
    
    // Indexes for faster queries
    table.index('room_id');
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('chat_room_members');
};
