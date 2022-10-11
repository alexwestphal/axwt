
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import {ArrayUtils} from '@axwt/util'

import {CellCoordinate} from '../../data'

import * as SU from '../SU'

import {CellState, PlayState} from './PlayState'



export const PlayReducer: Reducer<PlayState> = produce((draft: Draft<PlayState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/play/clearCell':
            clearCell(draft, action.meta)
            break

        case 'su/play/setCellValue': {
            let value = action.payload
            let {x,y} = action.meta, n = draft.boardSize, n2 = n*n
            let cellIndex = x + y * n2
            let cell = draft.cells[cellIndex]

            if(value == cell.value) break // Answer hasn't changed

            // Clear the cell of its previous value
            clearCell(draft, action.meta)

            // Set the cell value
            cell.value = value

            // Scan for conflicts
            for(let xi=0; xi<n2; xi++) if(xi != x) { // check each cell in column except the current one
                let otherCell = draft.cells[xi + y * n2]
                if(value == otherCell.value) {
                    cell.conflicts.push(xi + y * n2)
                    cell.valid = false
                    otherCell.conflicts.push(cellIndex)
                    otherCell.valid = false
                }
            }
            for(let yi=0; yi<n2; yi++) if(yi != y) { // check each cell in column except the current one
                let otherCell = draft.cells[x + yi * n2]
                if(value == otherCell.value) {
                    cell.conflicts.push(x + yi * n2)
                    cell.valid = false
                    otherCell.conflicts.push(cellIndex)
                    otherCell.valid = false
                }
            }
            let sx = Math.floor(x/n), sy = Math.floor(y/n)
            for(let yi = 0; yi < n; yi++) { // check each cell in sector except those in the same column or row
                for(let xi = 0; xi < n; xi++) {
                    let tx = sx*n + xi
                    let ty = sy*n + yi
                    let otherCell = draft.cells[tx + yi * n2]
                    if(value == otherCell.value && x != tx && y != ty) {
                        cell.conflicts.push(tx + ty * n2)
                        cell.valid = false
                        otherCell.conflicts.push(cellIndex)
                        otherCell.valid = false
                    }
                }
            }
            break
        }
        case 'su/play/start':
            let n = action.meta.boardSize
            draft.boardSize = action.meta.boardSize
            draft.cells = CellState.createArray(action.payload)
            draft.gameStage = 'Play'
            break
    }
}, PlayState.Default)


const clearCell = (draft: Draft<PlayState>, {x,y}: CellCoordinate) => {
    let index = x + y * draft.boardSize * draft.boardSize
    let cellState = draft.cells[index]

    cellState.value = 0
    cellState.valid = true
    cellState.notes = []

    for(let ci of cellState.conflicts) {
        let conflictAnswer = draft.cells[ci]
        if(!conflictAnswer.prefilled) {
            ArrayUtils.remove(conflictAnswer.conflicts, index)
            conflictAnswer.valid = conflictAnswer.conflicts.length > 0
        }
    }
    cellState.conflicts = []
}

