
import {createSelector, Selector} from 'reselect'

import {ChangeStack} from '@axwt/core'

import {Sudoku} from '../../data'
import * as SU from '../SU'
import {BoardState} from './BoardState'

export const selectBoardState: Selector<SU.RootState, BoardState> =
    (state) => state.su.board

export const selectBoardHistoryCanMove: Selector<SU.RootState, ChangeStack.CanMove> =
    (state) => ChangeStack.canMove(state.su.board)

export const selectEditBoard: Selector<SU.RootState, Sudoku.Board> =
    (state) => state.su.board.current