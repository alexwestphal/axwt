
import {Sudoku} from '../../data'

import {PlayActions} from './PlayActions'


export interface PlayState {
    gameStage: 'Init' | 'Play' | 'Done'
    entryMode: PlayEntryMode

    current: Sudoku.Board
    prevChange: PlayActions.Any
    history: Sudoku.Board[]
}

export namespace PlayState {
    export const Default: PlayState = {
        gameStage: 'Init',
        entryMode: 'Normal',
        current: null,
        prevChange: null,
        history: []
    }
}

export type PlayEntryMode = 'Normal' | 'Note'
