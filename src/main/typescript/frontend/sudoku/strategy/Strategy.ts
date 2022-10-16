import {SolveDirection, SolveResult, Sudoku} from '../data'

export interface Strategy {

    solve(board: Sudoku.Board, config: StrategyConfig): SolveResult
}

export interface StrategyConfig {
    stepLimit: number
    direction: SolveDirection
}
export namespace StrategyConfig {
    export const Default: StrategyConfig = {
        stepLimit: 10_000,
        direction: 'Forward',
    }
}