
import {createSelector, Selector} from 'reselect'

import {ChangeStack} from '@axwt/core'

import {AppMode, Sudoku} from '../../data'
import * as SU from '../SU'


export const selectBoardMode: Selector<SU.RootState, AppMode> =
    (state) => state.su.board.boardMode

export const selectBoardHistoryCanMove: Selector<SU.RootState, ChangeStack.CanMove> =
    (state) => ChangeStack.canMove(state.su.board)

export const selectEditBoard: Selector<SU.RootState, Sudoku.Board> =
    (state) => state.su.board.current