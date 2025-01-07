import { defineConfig } from 'drizzle-kit'

const connectionUrl = process.env.MAIN_VITE_DATABASE_URL

if (!connectionUrl) {
    throw new Error('MAIN_VITE_DATABASE_URL environment variable is not set')
}

console.log(`DB: configured ${connectionUrl}`)

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/main/lib/storage/storage.schema.ts',
    dbCredentials: {
        url: connectionUrl
    }
})
