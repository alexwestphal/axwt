
import {Reducer} from 'redux'
import produce, {castDraft, castImmutable, Draft} from 'immer'

import {ArrayUtils} from '@axwt/util'

import {Sudoku} from '../../data'

import * as SU from '../SU'

import {PlayState} from './PlayState'


export const PlayReducer: Reducer<PlayState> = produce((draft: Draft<PlayState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/play/applyNext': {
            let board = castImmutable(draft.current)

            for(let {x,y,value} of action.payload.foundValues) {
                board = Sudoku.setCellValueUser(board, x, y, value)
            }
            for(let {x,y,toClear} of action.payload.candidateClearances) {
                let candidates = Sudoku.getCell(board, x, y).candidates
                candidates = candidates.filter(c => !toClear.includes(c))
                board = Sudoku.setCellCandidates(board, x, y, candidates)
            }

            draft.current = castDraft(board)
            draft.searchResult = null
            draft.searchState = 'Ready'
            break
        }
        case 'su/play/clearCell':
            draft.current = castDraft(Sudoku.clearCell(draft.current, action.meta.x, action.meta.y))
            draft.prevChange = action
            draft.candidatesGenerated = false
            break
        case 'su/play/clearCellCandidates':
            draft.current = castDraft(Sudoku.clearCandidates(draft.current))
            draft.candidatesGenerated = false
            break
        case 'su/play/foundNext':
            draft.searchResult = castDraft(action.payload)
            draft.searchState = action.payload == null ? 'NotFound' : 'Found'
            break
        case 'su/play/generateNotes':
            draft.current = castDraft(action.payload)
            draft.prevChange = castDraft(action)
            draft.candidatesGenerated = true
            break
        case 'su/play/setCellCandidates':
            draft.current = castDraft(Sudoku.setCellCandidates(draft.current, action.meta.x, action.meta.y, action.payload))
            draft.prevChange = action
            draft.candidatesGenerated = false
            break
        case 'su/play/setCellValue':
            draft.current = castDraft(Sudoku.setCellValueUser(draft.current, action.meta.x, action.meta.y, action.payload))
            draft.prevChange = action
            break
        case 'su/play/setEntryMode':
            draft.entryMode = action.payload
            break
        case 'su/play/start':
            draft.current = castDraft(action.payload)
            draft.gameStage = 'Play'
            break
        case 'su/play/toggleAssistant':
            draft.assistant = draft.assistant == 'Off' ? 'On' : 'Off'
            break
        case 'su/play/toggleCellCandidate':
            draft.current = castDraft(Sudoku.toggleCellCandidate(draft.current, action.meta.x, action.meta.y, action.payload))
            draft.prevChange = action
            draft.candidatesGenerated = false
            break
        case 'su/play/toggleHighlight':
            draft.highlight = draft.highlight == 'Off' ? 'On' : 'Off'
            break
        case 'su/play/toggleTechnique':
            if(draft.techniques.includes(action.payload)) ArrayUtils.remove(draft.techniques, action.payload)
            else draft.techniques.push(action.payload)

            draft.searchResult = null
            draft.searchState = 'Ready'
            break
    }
}, PlayState.Default)
