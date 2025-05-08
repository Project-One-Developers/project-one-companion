import * as schema from '@storage/storage.schema'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { z } from 'zod'
import { store } from '../../app/store'
import { logger } from '../logger/logger'

type DbInstanceFromSchema = PostgresJsDatabase<typeof schema>

const getDatabaseUrl = (): string => {
    return process.env.MAIN_VITE_DATABASE_URL ?? store.getDatabaseUrl()
}

// Disable prefetch as it is not supported for "Transaction" pool mode
let dbClient: postgres.Sql | null = null
let dbInstance: DbInstanceFromSchema | null = null

export function getDb(): DbInstanceFromSchema {
    if (!dbInstance) {
        reloadConnection().catch(e => {
            throw new Error('getDb.reloadConnection: ' + e)
        })

        if (!dbInstance) {
            throw new Error('getDb.dbInstance is null')
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

export const closeDb = async (): Promise<void> => {
    if (!dbClient) {
        return
    }

    try {
        await dbClient.end()
    } catch (error) {
        logger.error('Error closing DB connection:', error)
    }
}

export const dbUrlSchema = z
    .string()
    .transform(str => str.replace(/^["']|["']$/g, ''))
    .refine(str => {
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
