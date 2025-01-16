import * as schema from '@storage/storage.schema'
import { drizzle } from 'drizzle-orm/node-postgres'
import { store } from '../../app/store'

import * as dotenv from 'dotenv'

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

export let db = drizzle({ connection: getDatabaseUrl(), casing: 'snake_case', schema: schema })

export const reloadConnection = (): void => {
    // Close existing connection if necessary
    // if (db && typeof db.$client.end === 'function') {
    //     db.$client.$client.connection
    // }

    // Recreate the database instance
    db = drizzle({ connection: getDatabaseUrl(), casing: 'snake_case', schema: schema })
}
