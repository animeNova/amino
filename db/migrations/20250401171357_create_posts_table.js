/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.createTable('posts', (table) => {
    table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.text('content').notNullable().alter();
    table.string('image');
    table.specificType('tags','text[]').notNullable();
    table.string('communityId').references('id').inTable('community').onDelete('CASCADE');
    table.string('userId').references('id').inTable('user').onDelete('CASCADE');
    table.enum('status',['pending' ,'accepted','rejected']).defaultTo('pending').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
