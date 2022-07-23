
import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {Reducer} from 'redux'

import {Alert, AlertTitle, Box} from '@mui/material'

import {cls} from '@axwt/util'

import {Body, Loading} from './components'
import * as Core from './store'
import StoreManager from '@axwt/core/StoreManager'



export interface Module<S = {}, E = {}, A extends Core.Action<any> = Core.AnyAction> {

    moduleCode: string
    displayName: string

    reducer: Reducer<S, A & Core.AnyAction>

    extraArgs: E

    render: React.ComponentType

    initAction?: () => Core.ThunkAction<void | Promise<void>, any, any, any>
}

export default Module

export const createModuleLauncher = (module: Module): React.ComponentType => {

    return function ModuleLauncher(props) {

        const storeManager = React.useContext(StoreManager.Context)

        const dispatch = Core.useThunkDispatch()

        const [ready, setReady] = React.useState(false)
        const handleReady = () => { setReady(true) }

        React.useEffect(() => {

            // Register the module
            storeManager.register(module)

            if(module.initAction) {
                let initReturn = dispatch(module.initAction())

                if(initReturn instanceof Promise) initReturn.then(handleReady)
                else {
                    // Init action is already complete
                    handleReady()
                }
            } else {
                // No Init action
                handleReady()
            }
        }, [])

        return <div className={cls(`Module-${module.moduleCode.toUpperCase()}`)}>
            <ErrorBoundary FallbackComponent={({error}) =>
                <Body>
                    <Box p={2}>
                        <Alert severity="error">
                            <AlertTitle>Error in {module.displayName}</AlertTitle>
                            <Box fontFamily="monospace">{error.message}</Box>
                        </Alert>
                    </Box>
                </Body>
            }>
                { ready ? React.createElement(module.render, {}) : <Loading/> }
            </ErrorBoundary>
        </div>
    }
}