/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.createTable('comments', (table) => {
    table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE');
      table.string('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
      table.text('content').notNullable();
      
      // Self-reference for nested comments (parent comment)
      table.string('parent_id').nullable().references('id').inTable('comments').onDelete('CASCADE');
      
      // Track nesting level for efficient querying and display
      table.integer('depth').defaultTo(0).notNullable();
      
      // Track reply count for efficient UI updates
      table.integer('reply_count').defaultTo(0).notNullable();
      
      // For ordering the top-level comments
      table.integer('position').nullable();
      
      // Path to root comment (useful for efficient sub-tree queries)
      table.specificType('path', 'text[]').defaultTo('{}');
      
      // Status tracking
      table.boolean('is_edited').defaultTo(false).notNullable();
      table.boolean('is_deleted').defaultTo(false).notNullable();
      
      // Timestamps
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
      
      // Indexes for faster lookups
      table.index('post_id');
      table.index('parent_id');
      table.index('depth');
      table.index('path', 'gin'); // GIN index for array operations
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
