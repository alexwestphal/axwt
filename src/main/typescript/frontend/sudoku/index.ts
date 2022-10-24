
import {Module, createModuleLauncher} from '@axwt/core'

import SudokuApp from './components/SudokuApp'
import * as SU from './store'
import {openDB} from 'idb'


export const SudokuModule: Module<SU.State, SU.ExtraArgs, SU.AnyAction> = {
    moduleCode: 'SU',
    displayName: 'suoku',

    reducer: SU.Reducer,

    extraArgs: {
        suDatabase: openDB('axwt-su-database', 1, {
            upgrade: (db) => {
                if(!db.objectStoreNames.contains('kv')) {
                    db.createObjectStore('kv', { keyPath: 'key' })
                }
            }
        })
    },

    render: SudokuApp,

    initAction: SU.init
}

export default createModuleLauncher(SudokuModule)