
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import {ConfigActions} from './ConfigActions'
import {ConfigState} from './ConfigState'

export const ConfigReducer: Reducer<ConfigState> = produce((draft: Draft<ConfigState>, action: ConfigActions.Any) => {
    switch (action.type) {
        case 'config/loadAccessToken':
            draft.accessToken = action.payload
            break
        case 'config/loadAppFlags':
            draft.appFlags = action.payload
            break
        case 'config/setAppFlag':
            draft.appFlags[action.meta.appFlag] = action.payload
            break
    }
}, ConfigState.Default)
