
import {Action, createAction} from '@axwt/core'

import {AppMode, Sudoku} from '../../data'

import * as SU from '../SU'

export namespace AppActions {

    export type LoadQuickSave = Action<'su/app/loadQuickSave', { board: Sudoku.Board }>

    export type QuickSave = Action<'su/app/quickSave'>

    export type SetMode = Action<'su/app/setMode', AppMode>

    export type Any = LoadQuickSave | QuickSave | SetMode


    export const loadQuickSave = (): SU.ThunkAction =>
        (dispatch) => {
            let jsonString = localStorage.getItem("AXWT-SU-QUICKSAVE")
            if(jsonString != null) {
                let json = JSON.parse(jsonString)
                let board = new Sudoku.Board(json.n, json.cells)
                dispatch(createAction('su/app/loadQuickSave', { board }))
            }
        }

    export const quickSave = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let state = getState()
            let board = state.su.board.current

            let json = JSON.stringify({ n: board.n, cells: board.cells })
            localStorage.setItem("AXWT-SU-QUICKSAVE", json)
        }


    export const setMode = (mode: AppMode): SetMode =>
        createAction('su/app/setMode', mode)
}