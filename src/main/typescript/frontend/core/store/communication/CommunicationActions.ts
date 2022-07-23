

import {Action, createAction} from '../Action'

export namespace CommunicationActions {

    export type RequestStart = Action<'server/requestStart', string>
    export type RequestEnd = Action<'server/requestEnd', string>
    export type RequestError = Action<'server/requestError', string>

    export type Reset = Action<'server/reset'>

    export type SaveStart = Action<'server/saveStart'>
    export type SaveEnd = Action<'server/saveEnd'>

    export type Any = RequestStart | RequestEnd | RequestError | Reset | SaveStart | SaveEnd

    export const requestStart = (requestKey: string): RequestStart => createAction('server/requestStart', requestKey, {}, true)
    export const requestEnd = (requestKey: string): RequestEnd => createAction('server/requestEnd', requestKey, {}, true)
    export const requestError = (requestKey: string): RequestError => createAction('server/requestError', requestKey, {}, true)

    export const reset = (): Reset => createAction('server/reset')

    export const saveStart = (): SaveStart => createAction('server/saveStart')
    export const saveEnd = (): SaveEnd => createAction('server/saveEnd')
}
