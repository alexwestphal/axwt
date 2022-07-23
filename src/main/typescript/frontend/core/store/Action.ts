
import { Action as ReduxAction } from 'redux'

export interface Action<T extends string, P = {}, M = {}> extends ReduxAction<T> {
    readonly type: T
    readonly payload: P
    readonly meta: M

    readonly hideDetails?: boolean
}

export const createAction = <T extends string, P = {}, M = {}>(type: T, payload: P = {} as P, meta: M = {} as M, hideDetails?: boolean): Action<T, P, M> => {
    let result: Action<T, P, M> = ({ type, payload, meta })
    if(hideDetails) result = { ...result, hideDetails }
    return result
}
