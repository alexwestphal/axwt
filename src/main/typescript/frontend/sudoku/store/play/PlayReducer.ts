
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'


import {Sudoku} from '../../data'

import * as SU from '../SU'

import {PlayState} from './PlayState'



export const PlayReducer: Reducer<PlayState> = produce((draft: Draft<PlayState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/play/clearCell':
            draft.current = castDraft(Sudoku.clearCell(draft.current, action.meta.x, action.meta.y))
            draft.prevChange = action
            break
        case 'su/play/generateNotes':
            draft.current = castDraft(Sudoku.calculateNotes(draft.current))
            draft.prevChange = action
            break
        case 'su/play/setCellNotes':
            draft.current = castDraft(Sudoku.setCellNotes(draft.current, action.meta.x, action.meta.y, action.payload))
            draft.prevChange = action
            break
        case 'su/play/setCellValue':
            draft.current = castDraft(Sudoku.setCellValueUser(draft.current, action.meta.x, action.meta.y, action.payload))
            draft.prevChange = action
            break
        case 'su/play/setEntryMode':
            draft.entryMode = action.payload
            break
        case 'su/play/start':
            draft.current = castDraft(Sudoku.fromValues(action.meta.boardSize, action.payload))
            draft.gameStage = 'Play'
            break
        case 'su/play/toggleNote': {
            draft.current = castDraft(Sudoku.toggleCellNote(draft.current, action.meta.x, action.meta.y, action.payload))
            draft.prevChange = action
            break
        }
    }
}, PlayState.Default)
