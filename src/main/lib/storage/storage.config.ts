import * as schema from '@storage/storage.schema'
import { drizzle } from 'drizzle-orm/node-postgres'

require('dotenv').config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
}

export const db = drizzle({ connection: databaseUrl, casing: 'snake_case', schema: schema })
