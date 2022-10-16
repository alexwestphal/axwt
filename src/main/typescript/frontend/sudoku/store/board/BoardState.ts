

import {BoardSize, BoardType, Sudoku} from '../../data'

export interface BoardState {
    boardType: BoardType
    boardSize: BoardSize

    current: Sudoku.Board
}

export namespace BoardState {
    export const Default: BoardState = {
        boardType: 'Standard',
        boardSize: 3,

        current: Sudoku.newBoard(3)

    }
}