
import {BoardSize, CellValueType} from '../../data'

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
    valueType: CellValueType
    notes: number[]
    conflicts: number[]
}

export namespace CellState {
    export const Default: CellState = ({
        value: 0,
        valueType: 'None',
        notes: [],
        conflicts: [],
    })

    export const createArray = (prefilledValues: number[]): CellState[] =>
        prefilledValues.map(pv => ({
            ...Default,
            value: pv,
            valueType: pv > 0 ? 'Prefilled' : 'None'
        }))
}
