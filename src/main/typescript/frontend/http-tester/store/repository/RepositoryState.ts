
import {IdMap} from '@axwt/core'

import {Request, RequestId} from '../../data'


export interface RepositoryState {
    requestsById: IdMap<RequestId, Request>
}

export namespace RepositoryState {
    export const Default: RepositoryState = {
        requestsById: {}
    }
}