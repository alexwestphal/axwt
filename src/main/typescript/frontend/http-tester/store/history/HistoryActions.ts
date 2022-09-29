
import {Action, createAction} from '@axwt/core'

import {Request, RequestId} from '../../data'

import * as HT from '../HT'
import {selectPastRequest} from '@axwt/http-tester/store'

export namespace HistoryActions {

    export type LoadFromDB = Action<'ht/history/loadFromDB', Request[]>

    export type OpenRequest = Action<'ht/history/openRequest', Request>

    export type RecordRequest = Action<'ht/history/recordRequest', Request>

    export type Any = LoadFromDB | OpenRequest | RecordRequest

    export const loadFromDB = (): HT.ThunkAction =>
        (dispatch, getState, { htDatabase }) => {
            htDatabase.then(db => {
                let tx = db.transaction('history', 'readonly')
                let store = tx.objectStore('history')
                return store.getAll()
            }).then(requests => {
                dispatch(createAction('ht/history/loadFromDB', requests))
            })
        }

    export const openRequest = (requestId: RequestId): HT.ThunkAction =>
        (dispatch, getState) => {
            let state = getState()
            let request = selectPastRequest(state, requestId)

            dispatch(createAction('ht/history/openRequest', request))
        }

    export const recordRequest = (request: Request): HT.ThunkAction =>
        (dispatch, getState, { htDatabase }) => {
            dispatch(createAction('ht/history/recordRequest', request))
        }
}
