/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
    await knex.schema.createTable('users' , (table) => {
        table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.boolean('emailVerified').defaultTo(false);
        table.string('image');
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
   })
   await knex.schema.createTable('session' , (table) => {
    table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('userId').references('id').inTable('users').onDelete('CASCADE');
    table.string('token');
    table.string('ipAddress');
    table.string('userAgent');
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    })
    await knex.schema.createTable('account' , (table) => {
        table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('userId').references('id').inTable('users').onDelete('CASCADE');
        table.string('accountId');
        table.string('providerId');
        table.string('accessToken');
        table.string('refreshToken');
        table.date('accessTokenExpiresAt')
        table.date('refreshTokenExpiresAt')
        table.string('scope');
        table.string('idToken');
        table.string('password');
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
   })
    await knex.schema.createTable('verification' , (table) => {
        table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('identifier');
        table.string('value');
        table.date('expiresAt');
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
    await  knex.schema.dropTable('users')
    await knex.schema.dropTable('session')
    await knex.schema.dropTable('account')
    await knex.schema.dropTable('verification')
};
