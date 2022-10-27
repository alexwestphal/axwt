
import {Action, createAction} from '@axwt/core'

import {AppMode, BoardSize, BoardType} from '../../data'

export namespace BoardActions {

    export type ChangeRedo = Action<'su/board/redoChange'>
    export type ChangeUndo = Action<'su/board/undoChange'>

    export type ClearCellValue = Action<'su/board/clearCellValue', null, { x: number, y: number }>

    export type NewBoard = Action<'su/board/newBoard', null, { boardType: BoardType, boardSize: BoardSize}>

    export type SetCellValue = Action<'su/board/setCellValue', number, { x: number, y: number }>

    export type SetMode = Action<'su/board/setMode', AppMode>

    export type Any = ChangeRedo | ChangeUndo | ClearCellValue | NewBoard | SetCellValue | SetMode


    export const changeRedo = (): ChangeRedo => createAction('su/board/redoChange')
    export const changeUndo = (): ChangeUndo => createAction('su/board/undoChange')

    export const clearCellValue = (x: number, y: number): ClearCellValue =>
        createAction('su/board/clearCellValue', null, { x, y })

    export const newBoard = (boardType: BoardType, boardSize: BoardSize): NewBoard =>
        createAction('su/board/newBoard', null, { boardType, boardSize })

    export const setCellValue = (x: number, y: number, value: number): SetCellValue =>
        createAction('su/board/setCellValue', value, { x, y })

    export const setMode = (mode: AppMode): SetMode =>
        createAction('su/board/setMode', mode)
}