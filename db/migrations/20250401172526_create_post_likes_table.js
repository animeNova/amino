/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.createTable('post_likes', (table) => {
    table.string('userId').references('id').inTable('user').onDelete('CASCADE');
    table.string('postId').references('id').inTable('posts').onDelete('CASCADE');
    table.primary(['userId', 'postId']);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
