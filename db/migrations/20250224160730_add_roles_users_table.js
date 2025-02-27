/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.alterTable('user' , (table) => {
        table.enum('role' , ['user','moderator','admin','superAdmin']).defaultTo('user');
        table.boolean('banned').defaultTo(false);
        table.string('banReason').nullable();
        table.integer('banExpires').nullable();
        table.string('impersonatedBy').references('id').inTable('user').nullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
    
};
