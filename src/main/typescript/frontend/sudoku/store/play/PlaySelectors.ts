
import {Selector} from 'reselect'

import {Sudoku} from '../../data'

import * as SU from '../SU'
import {PlayEntryMode, PlayState} from './PlayState'

export const selectPlayState: Selector<SU.RootState, PlayState> =
    (state) => state.su.play

export const selectPlayAssistant: Selector<SU.RootState, 'On' | 'Off'> =
    (state) => state.su.play.gameStage == 'Play' ? state.su.play.assistant : 'Off'

export const selectCurrentPlayBoard: Selector<SU.RootState, Sudoku.Board> =
    (state) => state.su.play.current || state.su.board.current

export const selectEntryMode: Selector<SU.RootState, PlayEntryMode> =
    (state) => state.su.play.entryMode

export const selectGameStage: Selector<SU.RootState, PlayState['gameStage']> =
    (state) => state.su.play.gameStage