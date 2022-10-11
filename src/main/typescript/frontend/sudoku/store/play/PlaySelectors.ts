
import {Selector} from 'reselect'

import * as SU from '../SU'
import {CellState, PlayState} from './PlayState'

export const selectPlayState: Selector<SU.RootState, PlayState> =
    (state) => state.su.play

export const selectUserAnswers: Selector<SU.RootState, CellState[]> =
    (state) => state.su.play.cells