/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.createTable('comment_likes', (table) => {
        table.string('comment_id').notNullable().references('id').inTable('comments').onDelete('CASCADE');
        table.string('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
        
        // Timestamps
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        
        // Unique constraint to prevent duplicate likes
        table.unique(['comment_id', 'user_id']);
        table.index(['comment_id', 'user_id']);
    }
    );  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
