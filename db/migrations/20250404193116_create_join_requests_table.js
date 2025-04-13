/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.createTable('join_request', (table) => {
        table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('userId').references('id').inTable('user').onDelete('CASCADE');
        table.string('communityId').references('id').inTable('community').onDelete('CASCADE');
        table.enum('status',['pending' ,'accepted','rejected']).defaultTo('pending').notNullable();
        table.string('responded_by').references('id').inTable('user').onDelete('CASCADE');
        table.date('requested_at').defaultTo(knex.fn.now());
        table.date('responded_at').defaultTo(knex.fn.now());
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
