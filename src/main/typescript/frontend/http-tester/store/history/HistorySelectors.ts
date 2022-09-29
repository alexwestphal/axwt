
import {Selector} from 'reselect'

import {Request, RequestId} from '../../data'

import * as HT from '../HT'

export const selectPastRequest: Selector<HT.RootState, Request, [RequestId]> =
    (state, requestId) => state.ht.history.requests.find(request => request.requestId == requestId)

export const selectAllPastRequests: Selector<HT.RootState, Request[]> =
    (state) => state.ht.history.requests