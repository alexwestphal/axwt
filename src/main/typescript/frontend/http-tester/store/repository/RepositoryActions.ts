
import {Action, createAction} from '@axwt/core'

import {DraftRequest, Request, RequestId} from '../../data'

import * as HT from '../HT'

import {selectSavedRequest} from './RepositorySelectors'



export namespace RepositoryActions {

    export type LoadFromDB = Action<'ht/repository/loadFromDB', Request[]>

    export type OpenRequest = Action<'ht/repository/openRequest', Request>

    export type SaveRequest = Action<'ht/repository/saveRequest', Request>

    export type Any = LoadFromDB | OpenRequest | SaveRequest


    export const loadFromDB = (): HT.ThunkAction =>
        (dispatch, getState, { htDatabase }) => {
            htDatabase.then(db => {
                let tx = db.transaction('repository', 'readonly')
                let store = tx.objectStore('repository')
                return store.getAll()
            }).then(requests => {
                dispatch(createAction('ht/repository/loadFromDB', requests))
            })
        }

    export const openRequest = (requestId: RequestId): HT.ThunkAction =>
        (dispatch, getState, { htDatabase }) => {
            let state = getState()
            let request = selectSavedRequest(state, requestId)

            htDatabase.then(db => {
                let tx = db.transaction('kv', 'readwrite')
                let store = tx.objectStore('kv')
                store.put({ key: 'currentDraftId', value: requestId })
            })

            dispatch(createAction('ht/repository/openRequest', request))
        }


    export const saveRequest = ({saved, dirty, ...request}: DraftRequest): HT.ThunkAction<Promise<void>> =>
        (dispatch, getState, { htDatabase }) => {
            return htDatabase.then(db => {
                let tx = db.transaction('repository', 'readwrite')
                let store = tx.objectStore('repository')

                store.put(request)
                dispatch(createAction('ht/repository/saveRequest', request))

                return tx.done
            })
        }
}
