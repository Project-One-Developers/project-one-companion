import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './storage.schema'

require('dotenv').config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
}

export const db = drizzle({ connection: databaseUrl, casing: 'snake_case', schema: schema })
