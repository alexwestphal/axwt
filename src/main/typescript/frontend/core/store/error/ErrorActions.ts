import {AXWTAnomaly} from '@axwt/core/data'

import {Action, createAction} from '../Action'

export namespace ErrorActions {

    export type AppendError = Action<'error/append', AXWTAnomaly>
    export type ClearError = Action<'error/clear'>


    export type Any = ClearError | AppendError

    export const clearError = (): ClearError => createAction('error/clear')

    export const appendError = (error: AXWTAnomaly): AppendError => createAction('error/append', error)
}