import {Selector} from 'reselect'

import {Request, RequestId} from '../../data'

import * as HT from '../HT'

export const selectSavedRequest: Selector<HT.RootState, Request, [RequestId]> =
    (state, requestId) => state.ht.repository.requestsById[requestId]

export const selectAllSavedRequests: Selector<HT.RootState, Request[]> =
    (state) => Object.values(state.ht.repository.requestsById)