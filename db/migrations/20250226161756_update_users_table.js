exports.up = function(knex) {
    // First enable the UUID extension if using PostgreSQL
    return knex.raw(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `)
    .then(() => {
      // Create a function to generate UUID-based usernames
      return knex.raw(`
        CREATE OR REPLACE FUNCTION generate_uuid_username() 
        RETURNS TEXT AS $$
        BEGIN
          RETURN 'user_' || substring(replace(uuid_generate_v4()::TEXT, '-', ''), 1, 8);
        END;
        $$ LANGUAGE plpgsql;
      `);
    })
    .then(() => {
      // Then create the users table with the UUID function as default for username
      return knex.schema.alterTable('user', table => {
        table.string('name').defaultTo(knex.raw('generate_uuid_username()')).alter();
      });
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('user')
      .then(() => {
        return knex.raw('DROP FUNCTION IF EXISTS generate_uuid_username();');
      });
  };