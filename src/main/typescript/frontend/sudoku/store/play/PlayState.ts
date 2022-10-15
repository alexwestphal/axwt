
import {BoardSize} from '../../data'

export interface PlayState {
    gameStage: 'Init' | 'Play' | 'Done'
    entryMode: PlayEntryMode
    boardSize: BoardSize
    cells: CellState[]
}

export namespace PlayState {
    export const Default: PlayState = {
        gameStage: 'Init',
        entryMode: 'Normal',
        boardSize: 3,
        cells: []
    }
}

export type PlayEntryMode = 'Normal' | 'Note'

export interface CellState {
    value: number
    prefilled: boolean
    valid: boolean
    notes: number[]
    conflicts: number[]
}

export namespace CellState {
    export const Default: CellState = ({
        value: 0,
        prefilled: false,
        valid: true,
        notes: [],
        conflicts: [],
    })

    export const createArray = (prefilledValues: number[]): CellState[] =>
        prefilledValues.map(pv => ({
            ...Default,
            value: pv,
            prefilled: pv > 0
        }))
}
