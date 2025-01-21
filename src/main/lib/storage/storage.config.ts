import * as schema from '@storage/storage.schema'
import { drizzle } from 'drizzle-orm/postgres-js'
import { store } from '../../app/store'

import * as dotenv from 'dotenv'
import postgres from 'postgres'

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
export let client = postgres(getDatabaseUrl(), { prepare: false })
export let db = drizzle({ client: client, casing: 'snake_case', schema: schema })

export const reloadConnection = (): void => {
    // Close existing connection if necessary
    if (client) {
        client.end()
    }

    // Create new client with updated URL
    client = postgres(getDatabaseUrl(), { prepare: false })

    // Recreate the database instance
    db = drizzle({ client: client, casing: 'snake_case', schema: schema })
}
