/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import * as PV from '../PV'
import {AppState} from './AppState'

export const AppReducer: Reducer<AppState> = produce((draft: Draft<AppState>, action: PV.AnyAction) => {
    switch(action.type) {
        case 'pv/app/loadState':
            return action.payload.app
        case 'pv/app/snackbarSet':
            draft.snackbar = action.payload
            break
        case 'pv/app/snackbarUnset':
            draft.snackbar = null
            break
    }
}, AppState.Default)