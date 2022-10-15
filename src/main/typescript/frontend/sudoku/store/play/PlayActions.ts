
import {Action, createAction} from '@axwt/core'

import {BoardSize} from '../../data'

import {selectBoardState} from '../board'
import * as SU from '../SU'

import {PlayEntryMode} from './PlayState'



export namespace PlayActions {

    export type ClearCell = Action<'su/play/clearCell', null, { x: number, y: number }>

    export type EndGame = Action<'su/play/end'>

    export type SetCellValue = Action<'su/play/setCellValue', number, { x: number, y: number }>

    export type SetEntryMode = Action<'su/play/setEntryMode', PlayEntryMode>

    export type StartGame = Action<'su/play/start', number[], { boardSize: BoardSize }>

    export type ToggleNote = Action<'su/play/toggleNote', number, { x: number, y: number }>

    export type Any = ClearCell |EndGame | SetCellValue |  SetEntryMode | StartGame | ToggleNote


    export const clearCell = (x: number, y: number): ClearCell =>
        createAction('su/play/clearCell', null, { x, y })

    export const endGame = (): EndGame =>
        createAction('su/play/end')

    export const setCellValue = (x: number, y: number, value: number): SetCellValue =>
        createAction('su/play/setCellValue', value, { x, y })

    export const setEntryMode = (entryMode: PlayEntryMode): SetEntryMode =>
        createAction('su/play/setEntryMode', entryMode)

    export const startGame = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let board = selectBoardState(getState())
            dispatch(createAction('su/play/start', board.cellValues, { boardSize: board.boardSize }))
        }

    export const toggleNote = (x: number, y: number, note: number): ToggleNote =>
        createAction('su/play/toggleNote', note, { x, y })
}