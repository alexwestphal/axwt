

import {AppOpts} from './data'
import * as Core from './store'

import StoreManager from './StoreManager'

class CommandLineInterface {

    readonly storeManager: StoreManager

    constructor(storeManager: StoreManager) {
        this.storeManager = storeManager
    }

    get appFlags(): AppOpts {
        let appFlags = Core.selectAppFlags(this.storeManager.store.getState())
        return AppOpts.createProxy(appFlags, (appFlag, value) => {
            this.storeManager.store.dispatch(Core.ConfigActions.setAppFlag(appFlag, value))
        })
    }
}