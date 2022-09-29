
import {openDB} from 'idb'

import {HttpTester} from './components/HttpTester'

import {Module, createModuleLauncher} from '@axwt/core'
import * as HT from './store'

export const HTModule: Module<HT.State, HT.ExtraArgs, HT.AnyAction> = {
    moduleCode: 'HT',
    displayName: 'http-tester',

    reducer: HT.Reducer,

    extraArgs: {
        htDatabase: openDB('axwt-ht-database', 3,{
            upgrade: (db) => {
                if(!db.objectStoreNames.contains('kv')) {
                    db.createObjectStore('kv', { keyPath: 'key' })
                }
                if(!db.objectStoreNames.contains('history')) {
                    db.createObjectStore('history', { keyPath: 'requestId' })
                }
                if(!db.objectStoreNames.contains('repository')) {
                    db.createObjectStore('repository', { keyPath: 'requestId' })
                }
            }
        })
    },

    render: HttpTester,

    initAction: HT.init
}

export default createModuleLauncher(HTModule)