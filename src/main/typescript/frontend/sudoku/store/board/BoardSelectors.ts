
import {createSelector, Selector} from 'reselect'

import {AppMode, Sudoku} from '../../data'
import * as SU from '../SU'

export const selectBoardMode: Selector<SU.RootState, AppMode> =
    (state) => state.su.board.boardMode

export const selectEditBoard: Selector<SU.RootState, Sudoku.Board> =
    (state) => state.su.board.current