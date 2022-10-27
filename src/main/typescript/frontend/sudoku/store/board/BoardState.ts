

import {AppMode, BoardSize, BoardType, Sudoku} from '../../data'
import {ChangeStack} from '@axwt/core/data/ChangeStack'
import {BoardActions} from '@axwt/sudoku/store'

export interface BoardState extends ChangeStack<Sudoku.Board, BoardActions.Any> {
    boardMode: AppMode

    boardType: BoardType
    boardSize: BoardSize

}

export namespace BoardState {
    export const Default: BoardState = {
        boardMode: 'Define',
        boardType: 'Standard',
        boardSize: 3,

        current: new Sudoku.Board(3),
        history: [],
        historyIndex: -1
    }
}