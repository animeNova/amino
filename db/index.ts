import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { Database } from './types'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  })
})

export const db = new Kysely<Database>({
  dialect,
})