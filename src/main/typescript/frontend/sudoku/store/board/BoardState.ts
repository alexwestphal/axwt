
import {ChangeStack, UUID} from '@axwt/core'

import {BoardSize, BoardType, Sudoku} from '../../data'
import {BoardActions} from './BoardActions'


export interface BoardState extends ChangeStack<Sudoku.Board, BoardActions.Any> {
    boardId: UUID
    boardName: string
    boardType: BoardType
    boardSize: BoardSize
}

export namespace BoardState {
    export const Default: BoardState = {
        boardId: null,
        boardName: "",
        boardType: 'Standard',
        boardSize: 3,

        current: null,
        history: [],
        historyIndex: -1,
    }
}