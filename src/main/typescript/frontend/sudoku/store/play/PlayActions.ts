
import {Action, createAction} from '@axwt/core'

import {BoardSize} from '../../data'

import {selectBoardState} from '../board'
import * as SU from '../SU'



export namespace PlayActions {

    export type ClearCell = Action<'su/play/clearCell', null, { x: number, y: number }>

    export type SetCellValue = Action<'su/play/setCellValue', number, { x: number, y: number }>

    export type EndGame = Action<'su/play/end'>

    export type StartGame = Action<'su/play/start', number[], { boardSize: BoardSize }>

    export type Any = ClearCell | SetCellValue | EndGame | StartGame


    export const clearCell = (x: number, y: number): ClearCell =>
        createAction('su/play/clearCell', null, { x, y })

    export const setCellValue = (x: number, y: number, value: number): SetCellValue =>
        createAction('su/play/setCellValue', value, { x, y })

    export const endGame = (): EndGame =>
        createAction('su/play/end')

    export const startGame = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let board = selectBoardState(getState())
            dispatch(createAction('su/play/start', board.cellValues, { boardSize: board.boardSize }))
        }


}