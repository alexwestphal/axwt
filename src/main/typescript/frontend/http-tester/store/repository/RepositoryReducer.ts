import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import * as HT from '../HT'

import {RepositoryState} from './RepositoryState'

export const RepositoryReducer: Reducer<RepositoryState> = produce((draft: Draft<RepositoryState>, action: HT.AnyAction) => {
    switch (action.type) {
        case 'ht/repository/loadFromDB':
            for(let request of action.payload) {
                draft.requestsById[request.requestId] = request
            }
            break
        case 'ht/repository/saveRequest':
            draft.requestsById[action.payload.requestId] = action.payload
            break
    }
}, RepositoryState.Default)