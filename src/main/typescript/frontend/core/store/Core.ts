
import * as ReactRedux from 'react-redux'
import {ReducersMapObject} from 'redux'
import * as ReduxThunk from 'redux-thunk'

import {UUID} from '../data'

import CoreServerAPI from '../CoreServerAPI'

import {Action, createAction} from './Action'

import {CommunicationActions, CommunicationReducer, CommunicationState} from './communication'
import {ConfigActions, ConfigReducer, ConfigState} from './config'
import {DisplayActions, DisplayReducer, DisplayState} from './display'
import {ErrorActions, ErrorReducer, ErrorState} from './error'



export type ExtraArgs = { coreServerAPI: CoreServerAPI, windows: Map<UUID, Window>, handles: Map<UUID, any> }

export type AnyAction = CommunicationActions.Any | ConfigActions.Any | DisplayActions.Any | ErrorActions.Any | RegisterModule

export type ThunkAction<R = void, MS = {}, ME = {}, MA extends Action<any> = AnyAction> =
    ReduxThunk.ThunkAction<R, State & MS, ExtraArgs & ME, AnyAction | MA>

export type ThunkDispatch<MS = {}, ME = {}, MA extends Action<any> = AnyAction> =
    ReduxThunk.ThunkDispatch<State & MS, ExtraArgs & ME, AnyAction | MA>

export interface State {
    readonly communication: CommunicationState
    readonly config: ConfigState
    readonly display: DisplayState
    readonly error: ErrorState
}

export namespace State {
    export const Default: State = {
        communication: CommunicationState.Default,
        config: ConfigState.Default,
        display: DisplayState.Default,
        error: ErrorState.Default
    }
}

export const Reducers: ReducersMapObject<State, AnyAction> = {
    communication: CommunicationReducer,
    config: ConfigReducer,
    display: DisplayReducer,
    error: ErrorReducer
}


// Hooks

export const useThunkDispatch = <TD = ThunkDispatch>() => ReactRedux.useDispatch<TD>()

export type TypedUseSelectorHook<MS = {}> = ReactRedux.TypedUseSelectorHook<State & MS>

export const useTypedSelector: TypedUseSelectorHook = ReactRedux.useSelector
export const useSelector = ReactRedux.useSelector


export type RegisterModule = Action<'core/registerModule', null, { moduleCode: string }>

export const registerModule = (moduleCode: string): RegisterModule =>
    createAction('core/registerModule', null, { moduleCode })





