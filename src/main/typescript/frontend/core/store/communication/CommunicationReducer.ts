

import {Reducer} from 'redux'
import {Draft, produce} from 'immer'

import { CommunicationState } from './CommunicationState'

export const CommunicationReducer: Reducer<CommunicationState> = produce((draft: Draft<CommunicationState>, action) => {
    switch(action.type) {
        case 'server/requestStart':
            draft.requests[action.payload] = 'InProgress'
            break
        case 'server/requestEnd':
            draft.requests[action.payload] = 'Done'
            break
        case 'server/reset':
            return CommunicationState.Default
        case 'server/saveStart':
            draft.saveStatus = 'InProgress'
            break
        case 'server/saveEnd':
            draft.saveStatus = 'Done'
            break
        default:
            if(draft.saveStatus == 'Done' && !action.type.startsWith('display')) draft.saveStatus = 'Ready'
    }
}, CommunicationState.Default)
