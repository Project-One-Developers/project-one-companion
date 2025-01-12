import * as schema from '@storage/storage.schema'
import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'

dotenv.config()

const databaseUrl = import.meta.env.MAIN_VITE_DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
}

export const db = drizzle({ connection: databaseUrl, casing: 'snake_case', schema: schema })
