
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import {ErrorActions} from './ErrorActions'
import {ErrorState} from './ErrorState'

export const ErrorReducer: Reducer<ErrorState> = produce((draft: Draft<ErrorState>, action: ErrorActions.Any) => {
    switch(action.type) {
        case 'error/clear':
            draft.showError = false
            break
        case 'error/append':
            draft.latestError = action.payload
            draft.showError = action.payload.anomalyKind != 'User'
    }
}, ErrorState.Default)
