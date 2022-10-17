
import {Action, createAction} from '@axwt/core'

import {Sudoku} from '../../data'

import {selectEditBoard} from '../board'
import * as SU from '../SU'

import {PlayEntryMode} from './PlayState'



export namespace PlayActions {

    export type ClearCell = Action<'su/play/clearCell', null, { x: number, y: number }>

    export type ClearNotes = Action<'su/play/clearNotes'>

    export type EndGame = Action<'su/play/end'>

    export type GenerateNotes = Action<'su/play/generateNotes'>

    export type SetCellNotes = Action<'su/play/setCellNotes', number[], { x: number, y: number }>

    export type SetCellValue = Action<'su/play/setCellValue', number, { x: number, y: number }>

    export type SetEntryMode = Action<'su/play/setEntryMode', PlayEntryMode>

    export type StartGame = Action<'su/play/start', Sudoku.Board>

    export type ToggleAssistant = Action<'su/play/toggleAssistant'>

    export type ToggleHighlight = Action<'su/play/toggleHighlight'>

    export type ToggleNote = Action<'su/play/toggleNote', number, { x: number, y: number }>

    export type Any = ClearCell | ClearNotes | EndGame | GenerateNotes | SetCellNotes | SetCellValue |  SetEntryMode
        | StartGame | ToggleAssistant | ToggleHighlight | ToggleNote


    export const clearCell = (x: number, y: number): ClearCell =>
        createAction('su/play/clearCell', null, { x, y })

    export const clearNotes = (): ClearNotes => createAction('su/play/clearNotes')

    export const endGame = (): EndGame => createAction('su/play/end')

    export const generateNotes = (): GenerateNotes => createAction('su/play/generateNotes')

    export const setCellNotes = (x: number, y: number, notes: number[]): SetCellNotes =>
        createAction('su/play/setCellNotes', notes, { x, y })

    export const setCellValue = (x: number, y: number, value: number): SetCellValue =>
        createAction('su/play/setCellValue', value, { x, y })

    export const setEntryMode = (entryMode: PlayEntryMode): SetEntryMode =>
        createAction('su/play/setEntryMode', entryMode)

    export const startGame = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let board = selectEditBoard(getState())
            dispatch(createAction('su/play/start', board))
        }

    export const toggleAssistant = (): ToggleAssistant => createAction('su/play/toggleAssistant')

    export const toggleHighlight = (): ToggleHighlight => createAction('su/play/toggleHighlight')

    export const toggleNote = (x: number, y: number, note: number): ToggleNote =>
        createAction('su/play/toggleNote', note, { x, y })
}