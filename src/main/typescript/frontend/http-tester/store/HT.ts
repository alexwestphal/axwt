
import {DBSchema, IDBPDatabase} from 'idb'
import {combineReducers} from 'redux'

import {Action, Core, DisplayActions} from '@axwt/core'

import {Request, RequestId} from '../data'

import {DraftActions, DraftReducer, DraftState} from './draft'
import {HistoryActions, HistoryReducer, HistoryState} from './history'
import {RepositoryActions, RepositoryReducer, RepositoryState} from './repository'


export interface DatabaseSchema extends DBSchema {
    'history': {
        key: RequestId
        value: Request
    }
    'kv': {
        key: string
        value: { key: string, value: string }
    }
    'repository': {
        key: RequestId
        value: Request
    }
}

export type ExtraArgs = {
    htDatabase: Promise<IDBPDatabase<DatabaseSchema>>
}

export type AnyAction = DraftActions.Any | HistoryActions.Any | RepositoryActions.Any

export type ThunkAction<R = void> = Core.ThunkAction<R, RootState, ExtraArgs, AnyAction>

export type ThunkDispatch = Core.ThunkDispatch<RootState, ExtraArgs, AnyAction>

export interface State {
    draft: DraftState
    history: HistoryState
    repository: RepositoryState
}

export namespace State {
    export const Default: State = {
        draft: DraftState.Default,
        history: HistoryState.Default,
        repository: RepositoryState.Default,
    }
}
export type RootState = Core.State & { ht: State }

export const Reducer = combineReducers<State>({
    draft: DraftReducer,
    history: HistoryReducer,
    repository: RepositoryReducer
})


// Hooks

export const useThunkDispatch = () => Core.useThunkDispatch<ThunkDispatch>()

export const useTypedSelector: Core.TypedUseSelectorHook<RootState> = Core.useSelector

export type Init = Action<'ht/init'>

export const init = (): ThunkAction =>
    (dispatch) => {
        dispatch(DisplayActions.setTitle("HTTP Tester"))
        dispatch(RepositoryActions.loadFromDB())

        dispatch(DraftActions.newDraft())
    }