
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import * as SU from '../SU'

import {Sudoku} from '../../data'

import {BoardState} from './BoardState'


export const BoardReducer: Reducer<BoardState> = produce((draft: Draft<BoardState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/app/loadQuickSave':
            draft.current = castDraft(action.payload.board)
            break

        case 'su/board/clearCellValue':
            draft.current = castDraft(draft.current.clearCell(action.meta.x, action.meta.y, false))
            break
        case 'su/board/newBoard':
            draft.boardType = action.meta.boardType
            draft.boardSize = action.meta.boardSize

            draft.current = castDraft(new Sudoku.Board(action.meta.boardSize))
            break
        case 'su/board/setCellValue':
            draft.current = castDraft(draft.current.setCellValueKnown(action.meta.x, action.meta.y, action.payload))
            break
    }
}, BoardState.Default)