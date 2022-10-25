import {DBSchema, openDB} from 'idb'

export const DatabaseSchemaVersion = 1

export interface DatabaseSchema extends DBSchema {
    'kv': {
        key: string
        value: { key: string, value: any }
    }
}

export const openDatabase = () => openDB<DatabaseSchema>('axwt-database', DatabaseSchemaVersion, {
    upgrade: (db) => {
        if(!db.objectStoreNames.contains('kv')) {
            db.createObjectStore('kv', { keyPath: 'key' })
        }
    }
})