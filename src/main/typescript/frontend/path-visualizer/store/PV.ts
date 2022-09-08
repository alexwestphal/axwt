/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Action, Core, DisplayActions, KeyboardShortcut, StandardShortcuts, UUID} from '@axwt/core'
import {combineReducers} from 'redux'


import {AppActions, AppReducer, AppState} from './app'
import {ConfigActions, ConfigReducer, ConfigState} from './config'
import {ElementsActions, ElementsReducer, ElementsState} from './elements'
import {PathSegmentsActions, PathSegmentsReducer, PathSegmentsState} from './pathSegments'


export type ExtraArgs = { }

export type AnyAction = AppActions.Any |  ConfigActions.Any | ElementsActions.Any | PathSegmentsActions.Any | Init

export type ThunkAction<R = void> = Core.ThunkAction<R, RootState, ExtraArgs, AnyAction>

export type ThunkDispatch = Core.ThunkDispatch<RootState, ExtraArgs, AnyAction>

export interface State {
    app: AppState
    config: ConfigState
    elements: ElementsState
    pathSegments: PathSegmentsState
}

export namespace State {
    export const Default: State = {
        app: AppState.Default,
        config: ConfigState.Default,
        elements: ElementsState.Default,
        pathSegments: PathSegmentsState.Default
    }
}
export type RootState = Core.State & { pv: State }

export const Reducer = combineReducers<State>({
    app: AppReducer,
    config: ConfigReducer,
    elements: ElementsReducer,
    pathSegments: PathSegmentsReducer
})


// Hooks

export const useThunkDispatch = () => Core.useThunkDispatch<ThunkDispatch>()

export const useTypedSelector: Core.TypedUseSelectorHook<RootState> = Core.useSelector


// Actions that don't have somewhere better to be

export type Init = Action<'pv/init'>

export const init = (): ThunkAction =>
    (dispatch) => {
        dispatch(DisplayActions.setTitle("Path Visualizer"))

        if(!dispatch(AppActions.loadFromLocalStorage())) {
            let elementId = UUID.create()
            dispatch(ElementsActions.newElement('path', elementId))
            dispatch(ElementsActions.selectCurrentElement({ elementType: 'path', elementId }))
        }
    }


export const handleKeyboardShortcut = (shortcut: KeyboardShortcut): ThunkAction =>
    (dispatch, getState) => {
        console.log(`PV.handleKeyboardShortcut: ${shortcut.shortcutId}`)

        switch(shortcut.shortcutId) {
            case StandardShortcuts.FileSave.shortcutId:
                dispatch(AppActions.save())
                break
        }
    }