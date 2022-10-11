
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import * as SU from '../SU'

import {AppState} from './AppState'

export const AppReducer: Reducer<AppState> = produce((draft: Draft<AppState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/app/setMode':
            draft.appMode = action.payload
            break
    }
}, AppState.Default)