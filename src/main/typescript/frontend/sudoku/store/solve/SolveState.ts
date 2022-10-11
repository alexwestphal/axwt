
import {SolveDirection, SolveResult, SolveStrategy} from '../../data'

export interface SolveState {
    strategy: SolveStrategy
    stepLimit: number
    solveDirection: SolveDirection
    result: SolveResult

    playback: 'Show' | 'Play' | 'Pause' | 'Reset'
    playbackSpeed: number // In steps per second
}

export namespace SolveState {
    export const Default: SolveState = {
        strategy: 'brute-force',
        stepLimit: 100_000,
        solveDirection: 'Forward',
        result: null,
        playback: 'Reset',
        playbackSpeed: 20
    }
}