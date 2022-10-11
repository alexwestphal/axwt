
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import * as SU from '../SU'


import {BoardState} from './BoardState'

export const BoardReducer: Reducer<BoardState> = produce((draft: Draft<BoardState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/app/loadQuickSave':
            return action.payload.board

        case 'su/board/clearCellValue':
            draft.cellValues[action.meta.x + action.meta.y * draft.boardSize * draft.boardSize] = 0
            break
        case 'su/board/newBoard':
            draft.boardType = action.meta.boardType
            draft.boardSize = action.meta.boardSize

            let cellData = Array(Math.pow(action.meta.boardSize, 4))
            for(let i=0; i < cellData.length; i++) {
                cellData[i] = 0
            }
            draft.cellValues = cellData
            break
        case 'su/board/setCellValue':
            draft.cellValues[action.meta.x + action.meta.y * draft.boardSize * draft.boardSize] = action.payload
            break
    }
}, BoardState.Default)