
import {Selector} from 'reselect'

import * as SU from '../SU'
import {CellState, PlayEntryMode, PlayState} from './PlayState'

export const selectPlayState: Selector<SU.RootState, PlayState> =
    (state) => state.su.play

export const selectEntryMode: Selector<SU.RootState, PlayEntryMode> =
    (state) => state.su.play.entryMode