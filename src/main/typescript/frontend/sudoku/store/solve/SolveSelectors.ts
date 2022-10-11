
import {Selector} from 'reselect'

import * as SU from '../SU'
import {SolveResult, SolveStrategy} from '@axwt/sudoku/data'

import {SolveState} from './SolveState'

export const selectSolveStrategy: Selector<SU.RootState, SolveStrategy> =
    (state) => state.su.solve.strategy

export const selectSolveState: Selector<SU.RootState, SolveState> =
    (state) => state.su.solve

export const selectSolveResult: Selector<SU.RootState, SolveResult> =
    (state) => state.su.solve.result