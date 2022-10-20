
import {Sudoku} from '../../data'
import {TechniqueKey, SearchResult} from '../../technique'

import {PlayActions} from './PlayActions'



export interface PlayState {
    gameStage: 'Init' | 'Play' | 'Done'
    entryMode: PlayEntryMode
    assistant: 'On' | 'Off'
    highlight: 'On' | 'Off'

    current: Sudoku.Board
    prevChange: PlayActions.Any
    history: Sudoku.Board[]

    techniques: TechniqueKey[]
    searchResult: SearchResult | null
    searchState: 'Ready' | 'Found' | 'NotFound'
    candidatesGenerated: boolean
}

export namespace PlayState {
    export const Default: PlayState = {
        gameStage: 'Init',
        entryMode: 'Normal',
        assistant: 'On',
        highlight: 'On',
        current: null,
        prevChange: null,
        history: [],

        techniques: ['NakedSingle', 'HiddenSingle', 'NakedPair', 'HiddenPair', 'PointingPair'],
        searchResult: null,
        searchState: 'Ready',
        candidatesGenerated: false

    }
}

export type PlayEntryMode = 'Normal' | 'Candidate'
