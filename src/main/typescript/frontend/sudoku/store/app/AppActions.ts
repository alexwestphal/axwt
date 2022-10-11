
import {Action, createAction} from '@axwt/core'

import {AppMode} from '../../data'

import {BoardState} from '../board'
import * as SU from '../SU'

export namespace AppActions {

    export type LoadQuickSave = Action<'su/app/loadQuickSave', { board: BoardState }>

    export type QuickSave = Action<'su/app/quickSave'>

    export type SetMode = Action<'su/app/setMode', AppMode>

    export type Any = LoadQuickSave | QuickSave | SetMode


    export const loadQuickSave = (): SU.ThunkAction =>
        (dispatch) => {
            let json = localStorage.getItem("AXWT-SU-QUICKSAVE")
            if(json != null) {
                dispatch(createAction('su/app/loadQuickSave', JSON.parse(json)))
            }
        }

    export const quickSave = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let state = getState()

            let json = JSON.stringify({ board: state.su.board })
            localStorage.setItem("AXWT-SU-QUICKSAVE", json)
        }


    export const setMode = (mode: AppMode): SetMode =>
        createAction('su/app/setMode', mode)
}