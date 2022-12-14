

import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'

/**
 * A Pointing-Pair involves a candidate that occurs twice (in a particular house) and where the two occurrences are also
 * both in another secondary house. We can deduce that the value must appear in one the two cells, and thus it can be
 * removed as a candidate from the rest of the secondary house.
 */
export class PointingPairTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let houseA of board.getAllHouses()) {
            let candidates = board.getCandidatesInHouse(houseA)
            
            for(let {candidate, occurrences} of candidates) {
                if(occurrences.length == 2) {
                    // Found a pair, need to check if it's pointing
                    let [occurrenceA, occurrenceB] = occurrences.map(i => board.indexToCoord(i))

                    let houseB: Sudoku.House = null
                    if(!houseA.isBlock() && board.isSameBlock(occurrenceA, occurrenceB)) {
                        let {sx, sy} = board.whichBlock(occurrenceA.x, occurrenceB.y)
                        houseB = board.getBlock(sx, sy)
                    } else if(!houseA.isColumn() && board.isSameColumn(occurrenceA, occurrenceB)) {
                        houseB = board.getColumn(occurrenceA.x)
                    } else if(!houseA.isRow() && board.isSameRow(occurrenceA, occurrenceB)) {
                        houseB = board.getRow(occurrenceA.y)
                    }

                    let candidateClearances: CandidateClearances[] = []
                    if(null != houseB) {
                        for(let cell of houseB.cells) {
                            if(!houseA.contains(cell) && cell.candidates.includes(candidate)) {
                                candidateClearances.push({
                                    x: cell.x,
                                    y: cell.y,
                                    toClear: [candidate]
                                })
                            }
                        }
                    }

                    if(candidateClearances.length > 0) {
                        return {
                            key: 'PointingPair',
                            candidateHighlights: [
                                { x: occurrenceA.x, y: occurrenceA.y, candidates: [candidate] },
                                { x: occurrenceB.x, y: occurrenceB.y, candidates: [candidate] },
                            ],
                            candidateClearances,
                            foundValues: [],
                            targetHouse: houseA

                        }
                    }
                }
            }
        }

       return null
    }
}