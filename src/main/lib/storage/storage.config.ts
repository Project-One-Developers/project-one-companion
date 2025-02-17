import * as schema from '@storage/storage.schema'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { store } from '../../app/store'

import * as dotenv from 'dotenv'
import postgres from 'postgres'
import { z } from 'zod'

// todo: va qua??
dotenv.config()

const getDatabaseUrl = (): string => {
    const envUrl = process.env.MAIN_VITE_DATABASE_URL
    if (envUrl) {
        console.log('[Database]: using database URL found in environment variables')
        return envUrl
    }

    const storedUrl = store.getDatabaseUrl()
    if (storedUrl) return storedUrl

    throw new Error('Database URL not found in environment variables or user settings')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
let dbClient: postgres.Sql | null = null
let dbInstance: PostgresJsDatabase<typeof schema> | null = null

export function initializeDb(connectionString: string) {
    if (!dbClient) {
        dbClient = postgres(connectionString, { prepare: false })
        dbInstance = drizzle({
            client: dbClient,
            casing: 'snake_case',
            schema: schema
        })
    }
    return dbInstance
}

export function getDb() {
    if (!dbInstance) {
        reloadConnection().catch(() => {
            throw new Error('Database not initialized. Call initializeDb first.')
        })

        if (!dbInstance) {
            throw new Error('Database not initialized. Call initializeDb first.')
        }

        return dbInstance
    }
    return dbInstance
}

export async function reloadConnection(): Promise<void> {
    if (dbClient) {
        await dbClient.end()
    }

    dbClient = postgres(getDatabaseUrl(), { prepare: false })
    dbInstance = drizzle({
        client: dbClient,
        casing: 'snake_case',
        schema: schema
    })
}

export const dbUrlSchema = z
    .string()
    .transform((str) => str.replace(/^["']|["']$/g, ''))
    .refine((str) => {
        try {
            const url = new URL(str)
            return (
                (url.protocol === 'postgres:' || url.protocol === 'postgresql:') &&
                !!url.hostname &&
                !!url.username &&
                !!url.pathname.slice(1) // database name
            )
        } catch {
            return false
        }
    }, 'Invalid PostgreSQL connection URL. Must include hostname, username, and database name')

export { getDb as db }
