
import {Action, createAction} from '@axwt/core'

import {BoardSize, BoardType} from '../../data'

export namespace BoardActions {

    export type ClearCellValue = Action<'su/board/clearCellValue', null, { x: number, y: number }>

    export type NewBoard = Action<'su/board/newBoard', null, { boardType: BoardType, boardSize: BoardSize}>

    export type SetCellValue = Action<'su/board/setCellValue', number, { x: number, y: number }>

    export type Any = ClearCellValue | NewBoard | SetCellValue


    export const clearCellValue = (x: number, y: number): ClearCellValue =>
        createAction('su/board/clearCellValue', null, { x, y })

    export const newBoard = (boardType: BoardType, boardSize: BoardSize): NewBoard =>
        createAction('su/board/newBoard', null, { boardType, boardSize })

    export const setCellValue = (x: number, y: number, value: number): SetCellValue =>
        createAction('su/board/setCellValue', value, { x, y })
}