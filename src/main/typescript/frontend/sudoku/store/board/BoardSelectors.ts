
import {createSelector, Selector} from 'reselect'

import {Sudoku} from '../../data'
import * as SU from '../SU'


export const selectEditBoard: Selector<SU.RootState, Sudoku.Board> =
    (state) => state.su.board.current