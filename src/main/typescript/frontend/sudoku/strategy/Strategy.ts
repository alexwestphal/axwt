import {BoardSize, BoardType, SolveDirection, SolveResult, SolveStep} from '../data'

export interface Strategy {

    solve(n: number, cellData: number[], config: StrategyConfig): SolveResult
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