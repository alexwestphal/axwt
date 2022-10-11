
import {combineReducers} from 'redux'

import {Core, DisplayActions} from '@axwt/core'

import {AppActions, AppReducer, AppState} from './app'
import {BoardActions, BoardReducer, BoardState} from './board'
import {PlayActions, PlayReducer, PlayState} from './play'
import {SolveActions, SolveReducer, SolveState} from './solve'

export type ExtraArgs = {}

export type AnyAction = AppActions.Any | BoardActions.Any | PlayActions.Any | SolveActions.Any

export type ThunkAction<R = void> = Core.ThunkAction<R, RootState, ExtraArgs, AnyAction>

export type ThunkDispatch = Core.ThunkDispatch<RootState, ExtraArgs, AnyAction>

export interface State {
    app: AppState
    board: BoardState
    solve: SolveState
    play: PlayState
}

export namespace State {
    export const Default: State = {
        app: AppState.Default,
        board: BoardState.Default,
        solve: SolveState.Default,
        play: PlayState.Default,
    }
}
export type RootState = Core.State & { su: State }

export const Reducer = combineReducers<State>({
    app: AppReducer,
    board: BoardReducer,
    solve: SolveReducer,
    play: PlayReducer,
})

// Hooks

export const useThunkDispatch = () => Core.useThunkDispatch<ThunkDispatch>()

export const useTypedSelector: Core.TypedUseSelectorHook<RootState> = Core.useSelector


export const init = (): ThunkAction =>
    (dispatch) => {
        dispatch(DisplayActions.setTitle("Sudoku"))
        //dispatch(BoardActions.newBoard('Standard', 3))
        dispatch(AppActions.loadQuickSave())
    }