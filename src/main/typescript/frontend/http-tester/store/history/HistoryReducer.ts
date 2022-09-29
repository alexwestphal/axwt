
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import * as HT from '../HT'

import {Request, QueryParameter, RequestHeader} from '../../data'

import {HistoryState} from './HistoryState'

export const HistoryReducer: Reducer<HistoryState> = produce((draft: Draft<HistoryState>, action: HT.AnyAction) => {
    switch(action.type) {
        case 'ht/history/loadFromDB':
            draft.requests = action.payload
            break
        case 'ht/history/recordRequest':
            draft.requests.push(action.payload)
            break
    }
}, HistoryState.Default)