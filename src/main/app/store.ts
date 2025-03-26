import { dbUrlSchema } from '@storage/storage.config'
import type { Rectangle } from 'electron'
import Store from 'electron-store'

interface StoreT {
    bounds: Rectangle
    databaseUrl: string
}

class AppStore {
    public DEFAULT_BOUNDS: Rectangle = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080
    }
    public DEFAULT_DATABASE_URL: string = '"postgresql://admin:admin@localhost:5432/postgres"'

    private store: Store<StoreT>
    public constructor() {
        this.store = new Store<StoreT>()
        if (!this.store.has('bounds')) {
            this.store.set('bounds', this.DEFAULT_BOUNDS)
        }
        if (!this.store.has('databaseUrl')) {
            this.store.set('databaseUrl', this.DEFAULT_DATABASE_URL)
        }
    }
    // window area
    public setBounds(bounds: Rectangle) {
        this.store.set('bounds', bounds)
    }
    public getBounds() {
        return this.store.get('bounds')
    }

    // database url
    public setDatabaseUrl(url: string) {
        const result = dbUrlSchema.safeParse(url)

        if (!result.success) {
            throw new Error(`Invalid database URL: ${result.error.message}`)
        }

        this.store.set('databaseUrl', result.data)
    }
    public getDatabaseUrl() {
        return this.store.get('databaseUrl')
    }

    // factory reset
    public factoryReset() {
        return this.store.clear()
    }
}

export const store = new AppStore()
