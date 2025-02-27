require('dotenv').config()

module.exports = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations',
      extension: 'js',  // Change to .js instead of .ts
    },
    seeds: {
      directory: './db/seeds',
    },
}