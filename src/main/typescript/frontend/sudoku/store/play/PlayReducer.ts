
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

        case 'su/play/generateNotes': {
            let n = draft.boardSize, n2 = n*n
            for(let y=0; y < n2; y++) {
                for(let x=0; x < n2; x++) {
                    let cell = draft.cells[x + y * n2]
                    if(cell.valueType == 'None') {
                        let notes = ArrayUtils.range(1, n2+1)

                        // Scan for values already in row
                        for(let xi=0; xi < n2; xi++) {
                            let otherCell = draft.cells[xi + y * n2]
                            if(otherCell.value > 0) ArrayUtils.remove(notes, otherCell.value)
                        }
                        //Scan for values already in column
                        for(let yi=0; yi < n2; yi++) {
                            let otherCell = draft.cells[x + yi * n2]
                            if(otherCell.value > 0) ArrayUtils.remove(notes, otherCell.value)
                        }
                        // Scan for values already in house
                        let hx = Math.floor(x/n), hy = Math.floor(y/n)
                        for(let yi=0; yi < n; yi++) {
                            for(let xi=0; xi < n; xi++) {
                                let tx = hx*n + xi
                                let ty = hy*n + yi
                                let otherCell = draft.cells[tx + ty * n2]
                                if(otherCell.value > 0) ArrayUtils.remove(notes, otherCell.value)
                            }
                        }

                        cell.notes = notes
                    }
                }
            }
            break
        }
        case 'su/play/setCellNotes': {
            let {x,y} = action.meta, n = draft.boardSize, n2 = n*n
            let cellIndex = x + y * n2
            let cell = draft.cells[cellIndex]
            cell.notes = action.payload
            break
        }

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

            // Scan for conflicts and clear notes
            for(let xi=0; xi<n2; xi++) if(xi != x) { // check each cell in column except the current one
                let otherCell = draft.cells[xi + y * n2]
                if(value == otherCell.value) {
                    cell.conflicts.push(xi + y * n2)
                    cell.valueType = 'Conflict'
                    otherCell.conflicts.push(cellIndex)
                    if(otherCell.valueType == 'Prefilled') otherCell.valueType = 'Conflict-Prefilled'
                    else if(otherCell.valueType == 'Guess') otherCell.valueType = 'Conflict'
                }
                ArrayUtils.remove(otherCell.notes, value)
            }
            for(let yi=0; yi<n2; yi++) if(yi != y) { // check each cell in column except the current one
                let otherCell = draft.cells[x + yi * n2]
                if(value == otherCell.value) {
                    cell.conflicts.push(x + yi * n2)
                    cell.valueType = 'Conflict'
                    otherCell.conflicts.push(cellIndex)
                    if(otherCell.valueType == 'Prefilled') otherCell.valueType = 'Conflict-Prefilled'
                    else if(otherCell.valueType == 'Guess') otherCell.valueType = 'Conflict'
                }
                ArrayUtils.remove(otherCell.notes, value)
            }
            let hx = Math.floor(x/n), hy = Math.floor(y/n)
            for(let yi = 0; yi < n; yi++) { // check each cell in house except those in the same column or row
                for(let xi = 0; xi < n; xi++) {
                    let tx = hx*n + xi
                    let ty = hy*n + yi
                    let otherCell = draft.cells[tx + ty * n2]
                    if(value == otherCell.value && x != tx && y != ty) {
                        cell.conflicts.push(tx + ty * n2)
                        cell.valueType = 'Conflict'
                        otherCell.conflicts.push(cellIndex)
                        if(otherCell.valueType == 'Prefilled') otherCell.valueType = 'Conflict-Prefilled'
                        else if(otherCell.valueType == 'Guess') otherCell.valueType = 'Conflict'
                    }
                    ArrayUtils.remove(otherCell.notes, value)
                }
            }
            break
        }
        case 'su/play/setEntryMode':
            draft.entryMode = action.payload
            break
        case 'su/play/start':
            draft.boardSize = action.meta.boardSize
            draft.cells = CellState.createArray(action.payload)
            draft.gameStage = 'Play'
            break
        case 'su/play/toggleNote': {
            let {x,y} = action.meta, n = draft.boardSize, n2 = n*n
            let notes = draft.cells[x + y * n2].notes

            if(notes.includes(action.payload)) ArrayUtils.remove(notes, action.payload)
            else notes.push(action.payload)

            break
        }
    }
}, PlayState.Default)


const clearCell = (draft: Draft<PlayState>, {x,y}: CellCoordinate) => {
    let index = x + y * draft.boardSize * draft.boardSize
    let cellState = draft.cells[index]

    cellState.value = 0
    cellState.valueType = 'None'
    cellState.notes = []

    for(let ci of cellState.conflicts) {
        let conflictCell = draft.cells[ci]
        ArrayUtils.remove(conflictCell.conflicts, index)
        if(conflictCell.conflicts.length == 0) {
            if(conflictCell.valueType == 'Conflict') conflictCell.valueType = 'Guess'
            else if(conflictCell.valueType == 'Conflict-Prefilled') conflictCell.valueType = 'Prefilled'
        }
    }
    cellState.conflicts = []
}

