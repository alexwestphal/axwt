
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import {ChangeStack, UUID} from '@axwt/core'

import * as SU from '../SU'

import {Sudoku} from '../../data'

import {BoardState} from './BoardState'



export const BoardReducer: Reducer<BoardState> = produce((draft: Draft<BoardState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/app/closeBoard':
            return BoardState.Default
        case 'su/app/redoChange':
            ChangeStack.moveForward(draft)
            break
        case 'su/app/undoChange':
            ChangeStack.moveBackward(draft)
            break


        case 'su/board/clearCellValue': {
            let newBoard = draft.current.clearCell(action.meta.x, action.meta.y, false)
            ChangeStack.push(draft, newBoard)
            break
        }
        case 'su/board/newBoard': {
            draft.boardId = action.payload
            draft.boardName = action.meta.boardName
            draft.boardType = action.meta.boardType
            draft.boardSize = action.meta.boardSize

            let newBoard = new Sudoku.Board(action.meta.boardSize)
            ChangeStack.init(draft, newBoard)

            break
        }
        case 'su/board/setCellValue': {
            let newBoard = draft.current.setCellValueKnown(action.meta.x, action.meta.y, action.payload)
            ChangeStack.push(draft, newBoard)
            break
        }
        case 'su/board/setName':
            draft.boardName = action.payload
            break
    }
}, BoardState.Default)