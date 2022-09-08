
import * as React from 'react'
import {Provider as ReduxProvider} from 'react-redux'
import {applyMiddleware, combineReducers, createStore, Reducer, ReducersMapObject, Store as ReduxStore} from 'redux'
import thunk from 'redux-thunk'

import loggerMiddleware from './middleware/logger'
import * as Core from './store'

import AbstractServerAPI from './AbstractServerAPI'
import CoreServerAPI from './CoreServerAPI'
import Module from './Module'

export class StoreManager {

    static readonly Context = React.createContext<StoreManager>(null)

    readonly extraArgs: Core.ExtraArgs & { [key: string]: any }
    readonly reducers: ReducersMapObject
    readonly store: ReduxStore & { dispatch: Core.ThunkDispatch }

    readonly modules: { [moduleCode: string]: Module }

    constructor() {
        let coreServerAPI = new CoreServerAPI()
        this.extraArgs = { coreServerAPI: coreServerAPI, windows: new Map(), handles: new Map() }

        this.reducers = Core.Reducers

        const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunk.withExtraArgument(this.extraArgs))
        const initialReducer = this.createRootReducer()

        this.store = createStore(initialReducer, Core.State.Default, middlewareEnhancer)

        coreServerAPI.setDispatch(action => {
            this.store.dispatch(action)
        })

        this.modules = {}
    }

    register(module: Module) {
        let moduleCode = module.moduleCode.toLowerCase()

        if(this.modules[module.moduleCode]) {
            // Already registered
            return
        }

        let existingEAKeys = Object.keys(this.extraArgs)
        let extraArgsKeys = Object.keys(module.extraArgs)
        if(extraArgsKeys.some(key => existingEAKeys.includes(key))) {
            throw new Error(`Invalid Module(${module.moduleCode}): 'extraArgs' (${existingEAKeys}) overlaps existing (${existingEAKeys})`)
        }

        // Attach the module's reducer
        this.reducers[moduleCode] = module.reducer

        let accessToken = Core.selectAccessToken(this.store.getState())

        this.store.dispatch(Core.registerModule(moduleCode))
        this.store.replaceReducer(this.createRootReducer())


        // Patch the extraArgs object
        for(let key of extraArgsKeys) {
            let value = module.extraArgs[key]

            if(value instanceof AbstractServerAPI) {
                // Setup the API class
                value.setAccessToken(accessToken)
                value.setDispatch(this.store.dispatch)
            }

            this.extraArgs[key] = module.extraArgs[key]
        }

        // Add to the module list
        this.modules[moduleCode] = module

    }

    get Provider(): React.ComponentType<React.PropsWithChildren<{}>> {
        return ({children}) =>
            React.createElement(StoreManager.Context.Provider, { value: this },
                React.createElement(ReduxProvider, { store: this.store}, children)
            )
    }


    private createRootReducer(): Reducer<Core.State> {
        let reducer = combineReducers(this.reducers)
        return (state, action: Core.AnyAction) => {
            if(action.type == 'core/registerModule') {
                return {...state, [action.meta.moduleCode.toLowerCase()]: {} }
            } else return reducer(state, action)
        }
    }
}

export default StoreManager