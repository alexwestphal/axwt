
import {ArrayUtils} from '@axwt/util'

import {Sudoku} from '../data'
import {SearchResult, SearchTechnique} from './SearchTechnique'


/**
 * A Naked-Triple involves three cells (in the same house) that between them only have three (unique) candidates. This
 * can occur with all three candidates in all three cells or combinations of them. We can deduce that those three values
 * must occur in those three cells and therefore can be removed as candidates from the rest of the house.
 */
export class NakedTripleTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of board.getAllHouses()) {

        }

        return null
    }

    private findCells(board: Sudoku.Board, house: Sudoku.House): [Sudoku.Cell, Sudoku.Cell, Sudoku.Cell] | null {
        for(let i = 0; i < board.n2; i++) {
            let cellA = house.cells[i]

            if(cellA.candidates.length == 3) {
                // Found an ABC

                for(let j = 0; j < board.n2; j++) {
                    let cellB = house.cells[j]

                    if(ArrayUtils.isSubset(cellB.candidates, cellA.candidates)) {
                        // Found one of (AB, AC, or BC)

                        for(let k = j+1; k < board.n2; k++) {
                            let cellC = house.cells[k]

                            if(ArrayUtils.isSubset(cellC.candidates, cellA.candidates)) {
                                // Found another of (AB, AC, or BC)
                                return [cellA, cellB, cellC]
                            }
                        }
                    }
                }
            }

            // Can't find a set starting with 3 candidates. Might still be able to find a circle (AB, AC, and BC).
            if(cellA.candidates.length == 2) {
                // Found an AB

                for(let j = i+1; j < board.n2; j++) {
                    let cellB = house.cells[j]

                    if(cellB.candidates.length == 2 && ) {}
                }
            }
        }
        return null
    }


}