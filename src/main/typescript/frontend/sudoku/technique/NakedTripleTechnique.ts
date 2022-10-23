
import {SetUtils} from '@axwt/util'

import {Sudoku} from '../data'
import {CandidateClearances, SearchResult, SearchTechnique} from './SearchTechnique'


/**
 * A Naked-Triple involves three cells (in the same house) that between them only have three (unique) candidates. This
 * can occur with all three candidates in all three cells or combinations of them. We can deduce that those three values
 * must occur in those three cells and therefore can be removed as candidates from the rest of the house.
 *
 * This technique should locate cells (within a house) with the following candidate combinations:
 * - ABC, ABC, ABC (Perfect Triple)
 * - ABC, ABC, AB
 * - ABC, AB, AB (Technically a NakedPair)
 * - ABC, AB, AC
 * - AB, AC, BC (Circle)
 * - AB, AB, BC (Technically a NakedPair)
 */
export class NakedTripleTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of board.getAllHouses()) {
            let cells = this.findCells(board, house)
            if(cells != null) {
                let [cellI, cellJ, cellK] = cells
                let indexes = cells.map(cell => cell.index)
                let targetCandidates = SetUtils.union(cellI.candidates, cellJ.candidates, cellK.candidates)

                let candidateClearances: CandidateClearances[] = house.cells
                    .filter(cell => !indexes.includes(cell.index))
                    .map(cell => ({
                        x: cell.x, y: cell.y,
                        toClear: SetUtils.intersect(cell.candidates, targetCandidates)
                    }))
                    .filter(cc => cc.toClear.length > 0)

                if(candidateClearances.length > 0) {
                    return {
                        key: 'NakedTriple',
                        candidateHighlights: cells.map(cell => ({ x: cell.x, y: cell.y, candidates: cell.candidates })),
                        candidateClearances,
                        foundValues: [],
                        targetHouse: house
                    }
                }
            }
        }

        return null
    }

    private findCells(board: Sudoku.Board, house: Sudoku.House): [Sudoku.Cell, Sudoku.Cell, Sudoku.Cell] | null {
        for(let i = 0; i < board.n2; i++) {
            let cellI = house.cells[i]

            if(cellI.candidates.length == 3) {
                // Found an ABC

                for(let j = 0; j < board.n2; j++) {
                    let cellJ = house.cells[j]

                    if(cellJ.index != cellI.index && (cellJ.candidates.length == 2 || cellJ.candidates.length == 3)
                        && SetUtils.isSubset(cellJ.candidates, cellI.candidates)) {
                        // Found one of (AB, AC, or BC)

                        for(let k = j+1; k < board.n2; k++) {
                            let cellK = house.cells[k]

                            if((cellK.candidates.length == 2 || cellK.candidates.length == 3)
                                && SetUtils.isSubset(cellK.candidates, cellI.candidates)) {
                                // Found another of (AB, AC, or BC)
                                return [cellI, cellJ, cellK]
                            }
                        }
                    }
                }
            }

            // Can't find a set starting with 3 candidates. Might still be able to find a circle (AB, AC, and BC).
            if(cellI.candidates.length == 2) {
                // Found an AB

                for(let j = i+1; j < board.n2; j++) {
                    let cellJ = house.cells[j]

                    if(cellJ.candidates.length == 2 ) {

                        let intersectAB = SetUtils.intersect(cellI.candidates, cellJ.candidates)

                        if(intersectAB.length == 2) {
                            // Found another AB (technically a NakedPair, but we can deal with)

                            for(let k = j+1; k < board.n2; k++) {
                                let cellK = house.cells[k]

                                if(cellK.candidates.length == 2) {
                                    let intersectAC = SetUtils.intersect(cellI.candidates, cellK.candidates)

                                    if(intersectAC.length == 2) {
                                        // Found AB again (board is broken)

                                    } else if(intersectAC.length == 1) {
                                        // Found AC or BC
                                        return [cellI, cellJ, cellK]
                                    }
                                }
                            }
                        } else if(intersectAB.length == 1) {
                            // Found AC
                            let candidates = SetUtils.union(cellI.candidates, cellJ.candidates)

                            for(let k = j+1; k < board.n2; k++) {
                                let cellK = house.cells[k]

                                if(cellK.candidates.length == 2 && SetUtils.isSubset(cellK.candidates, candidates)) {
                                    // Found AB, AC, or BC
                                    return [cellI, cellJ, cellK]
                                }
                            }
                        }
                    }
                }
            }
        }
        return null
    }


}