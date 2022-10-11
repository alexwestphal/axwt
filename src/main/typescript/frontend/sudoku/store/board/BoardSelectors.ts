
import {createSelector, Selector} from 'reselect'

import * as SU from '../SU'
import {BoardState} from './BoardState'

export const selectBoardState: Selector<SU.RootState, BoardState> =
    (state) => state.su.board