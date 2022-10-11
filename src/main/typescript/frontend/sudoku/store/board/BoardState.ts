

import {BoardSize, BoardType} from '../../data'

export interface BoardState {
    boardType: BoardType
    boardSize: BoardSize

    cellValues: number[]
}

export namespace BoardState {
    export const Default: BoardState = {
        boardType: 'Standard',
        boardSize: 3,

        cellValues: Array(81)

    }
}