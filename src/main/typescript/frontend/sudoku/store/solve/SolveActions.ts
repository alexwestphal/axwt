
import {Action, createAction} from '@axwt/core'

import {SolveDirection, SolveResult, SolveStrategy} from '../../data'
import {BruteForceStandardStrategy, StrategyConfig} from '../../strategy'

import {selectEditBoard} from '../board'
import * as SU from '../SU'

import {selectSolveState} from './SolveSelectors'

export namespace SolveActions {

    export type ClearSolution = Action<'su/solve/clear'>

    export type CreateSolution = Action<'su/solve/createSolution', SolveResult>

    export type PlaySteps = Action<'su/solve/play'>
    export type PausePlayback = Action<'su/solve/pause'>
    export type ResetPlayback = Action<'su/solve/reset'>

    export type SetDirection = Action<'su/solve/setDirection', SolveDirection>

    export type SetPlaybackSpeed = Action<'su/solve/setPlaybackSpeed', number>

    export type SetStepLimit = Action<'su/solve/setStepLimit', number>

    export type SetStrategy = Action<'su/solve/setStrategy', SolveStrategy>

    export type ShowResult = Action<'su/solve/show'>

    export type Any = ClearSolution | CreateSolution | PlaySteps | PausePlayback | ResetPlayback | SetDirection | SetPlaybackSpeed | SetStepLimit | SetStrategy | ShowResult


    export const clearSolution = (): ClearSolution =>
        createAction('su/solve/clear')

    export const createSolution = (): SU.ThunkAction =>
        (dispatch, getState) => {
            let state = getState()
            let board = selectEditBoard(state)
            let solveState = selectSolveState(state)

            let strategy = new BruteForceStandardStrategy()
            let config: StrategyConfig = {
                stepLimit: solveState.stepLimit,
                direction: solveState.solveDirection
            }
            let result = strategy.solve(board, config)

            dispatch(createAction('su/solve/createSolution', result))
        }

    export const play = (): PlaySteps =>
        createAction('su/solve/play')

    export const pause = (): PausePlayback =>
        createAction('su/solve/pause')

    export const reset = (): ResetPlayback =>
        createAction('su/solve/reset')

    export const setDirection = (direction: SolveDirection): SetDirection => {
        return createAction('su/solve/setDirection', direction)
    }

    export const setPlaybackSpeed = (playbackSpeed: number): SetPlaybackSpeed =>
        createAction('su/solve/setPlaybackSpeed', playbackSpeed)

    export const setStepLimit = (stepLimit: number): SetStepLimit =>
        createAction('su/solve/setStepLimit', stepLimit)

    export const setStrategy = (strategy: SolveStrategy): SetStrategy =>
        createAction('su/solve/setStrategy', strategy)

    export const showResult = (): ShowResult =>
        createAction('su/solve/show')
}