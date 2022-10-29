
import {Action, createAction, UUID} from '@axwt/core'

import {BoardSize, BoardType} from '../../data'


export namespace BoardActions {

    export type ClearCellValue = Action<'su/board/clearCellValue', null, { x: number, y: number }>

    export type NewBoard = Action<'su/board/newBoard', UUID, { boardName: string, boardType: BoardType, boardSize: BoardSize}>

    export type SetCellValue = Action<'su/board/setCellValue', number, { x: number, y: number }>

    export type SetName = Action<'su/board/setName', string>

    export type Any = ClearCellValue | NewBoard | SetCellValue | SetName


    export const clearCellValue = (x: number, y: number): ClearCellValue =>
        createAction('su/board/clearCellValue', null, { x, y })

    export const newBoard = (boardName: string, boardType: BoardType, boardSize: BoardSize): NewBoard =>
        createAction('su/board/newBoard', UUID.create(), { boardName, boardType, boardSize })

    export const setCellValue = (x: number, y: number, value: number): SetCellValue =>
        createAction('su/board/setCellValue', value, { x, y })

    export const setName = (name: string): SetName => createAction('su/board/setName', name)
}