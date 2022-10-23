
import {ArrayUtils, SetUtils} from '@axwt/util'

import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'

/**
 * A Naked-Pair involves two cells (in the same house) that have exactly 2 candidates and which are the same candidates
 * between the two cells. We can deduce that those two values must occur in those two cells and therefore can be
 * removed as candidates from the rest of the house.
 */
export class NakedPairTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of board.getAllHouses()) {
            for(let i = 0; i < board.n2 - 1; i++) {
                let cellA = house.cells[i]
                if(cellA.candidates.length == 2) {
                    // Half a pair
                    for(let j= i+1; j < board.n2; j++) {
                        let cellB = house.cells[j]
                        if(ArrayUtils.equals(cellA.candidates, cellB.candidates)) {
                            // Naked pair found

                            let candidateClearances: CandidateClearances[] = house.cells
                                .filter(cell => cell.index != cellA.index && cell.index != cellB.index)
                                .map(cell => ({
                                    x: cell.x, y: cell.y,
                                    toClear: SetUtils.intersect(cell.candidates, cellA.candidates)
                                }))
                                .filter(cc => cc.toClear.length > 0)

                            if(candidateClearances.length > 0) {
                                return {
                                    key: 'NakedPair',
                                    candidateHighlights: [
                                        { x: cellA.x, y: cellA.y, candidates: cellA.candidates },
                                        { x: cellB.x, y: cellB.y, candidates: cellB.candidates },
                                    ],
                                    candidateClearances,
                                    foundValues: [],
                                    targetHouse: house
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