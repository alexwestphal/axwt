
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import {ChangeStack} from '@axwt/core'

import * as SU from '../SU'

import {Sudoku} from '../../data'

import {BoardState} from './BoardState'



export const BoardReducer: Reducer<BoardState> = produce((draft: Draft<BoardState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/app/loadQuickSave':
            ChangeStack.init(draft, action.payload.board)
            break

        case 'su/board/clearCellValue': {
            let newBoard = draft.current.clearCell(action.meta.x, action.meta.y, false)
            ChangeStack.push(draft, newBoard)
            break
        }
        case 'su/board/newBoard': {
            draft.boardType = action.meta.boardType
            draft.boardSize = action.meta.boardSize

            let newBoard = new Sudoku.Board(action.meta.boardSize)
            ChangeStack.init(draft, newBoard)

            break
        }
        case 'su/board/redoChange':
            ChangeStack.moveForward(draft)
            break

        case 'su/board/setCellValue': {
            let newBoard = draft.current.setCellValueKnown(action.meta.x, action.meta.y, action.payload)
            ChangeStack.push(draft, newBoard)
            break
        }
        case 'su/board/setMode':
            draft.boardMode = action.payload
            break
        case 'su/board/undoChange':
            ChangeStack.moveBackward(draft)
            break

    }
}, BoardState.Default)