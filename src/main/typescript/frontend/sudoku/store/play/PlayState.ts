
import {Sudoku} from '../../data'

import {PlayActions} from './PlayActions'


export interface PlayState {
    gameStage: 'Init' | 'Play' | 'Done'
    entryMode: PlayEntryMode
    assistant: 'On' | 'Off'
    highlight: 'On' | 'Off'

    current: Sudoku.Board
    prevChange: PlayActions.Any
    history: Sudoku.Board[]
}

export namespace PlayState {
    export const Default: PlayState = {
        gameStage: 'Init',
        entryMode: 'Normal',
        assistant: 'Off',
        highlight: 'On',
        current: null,
        prevChange: null,
        history: []
    }
}

export type PlayEntryMode = 'Normal' | 'Note'
