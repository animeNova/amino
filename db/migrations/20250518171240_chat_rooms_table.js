/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // First create the chat_rooms table
    .createTable('chat_rooms', (table) => {
      // Primary key
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      
      // Room information
      table.string('name').notNullable();
      table.text('description');
      table.string('image').nullable();
      table.string('type').notNullable().defaultTo('public'); // public, private, direct
      
      // Relationships
      table.string('community_id').references('id').inTable('community').onDelete('CASCADE');
      table.string('created_by').references('id').inTable('user').onDelete('SET NULL');
      
      // Timestamps
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Indexes
      table.index('community_id');
      table.index('type');
    })
    // Then create the chat_messages table
    .createTable('chat_messages', (table) => {
      // Primary key
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      
      // Message content
      table.text('content').notNullable();
      table.jsonb('attachments').nullable(); // For images, files, etc.
      table.string('type').defaultTo('text'); // text, image, file, etc.
      
      // Relationships
      table.uuid('room_id').references('id').inTable('chat_rooms').onDelete('CASCADE').notNullable();
      table.string('user_id').references('id').inTable('user').onDelete('CASCADE').notNullable();
      table.uuid('reply_to').references('id').inTable('chat_messages').onDelete('SET NULL').nullable();
      
      // Message status
      table.boolean('is_edited').defaultTo(false);
      table.boolean('is_deleted').defaultTo(false);
      
      // Timestamps
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Indexes for faster queries
      table.index('room_id');
      table.index('user_id');
      table.index('created_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('chat_messages')
    .dropTableIfExists('chat_rooms');
};
