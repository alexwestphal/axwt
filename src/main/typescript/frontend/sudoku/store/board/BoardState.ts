

import {AppMode, BoardSize, BoardType, Sudoku} from '../../data'

export interface BoardState {
    boardMode: AppMode

    boardType: BoardType
    boardSize: BoardSize

    current: Sudoku.Board
}

export namespace BoardState {
    export const Default: BoardState = {
        boardMode: 'Define',
        boardType: 'Standard',
        boardSize: 3,

        current: new Sudoku.Board(3)

    }
}