
import {Selector} from 'reselect'

import {CommunicationStatus} from './CommunicationState'
import * as Core from '../Core'


export const selectRequestStatus: Selector<Core.State, CommunicationStatus, [Function]> =
    (state, requestFunction) => state.communication.requests[requestFunction.name] || 'Ready'

export const selectSaveStatus: Selector<Core.State, CommunicationStatus> =
    (state) => state.communication.saveStatus