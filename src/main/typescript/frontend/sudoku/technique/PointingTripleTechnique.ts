
import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'

/**
 * A Pointing-Triple involves a candidate that occurs three times (in a particular house) and where the three occurrences
 * are all in another secondary house. We can deduce that the value must appear in one the three cells, and thus it can
 * be removed as a candidate from the rest of the secondary house.
 */
export class PointingTripleTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {
        for(let houseA of board.getAllHouses()) {
            let candidates = board.getCandidatesInHouse(houseA)

            for(let {candidate, occurrences} of candidates) {
                if(occurrences.length == 3) {
                    // Found a triple, need to check if it's pointing
                    let [occurrenceA, occurrenceB, occurrenceC] = occurrences.map(i => board.indexToCoord(i))

                    let houseB: Sudoku.House = null
                    if(!houseA.isBlock() && board.isSameBlock(occurrenceA, occurrenceB) && board.isSameBlock(occurrenceA, occurrenceC)) {
                        let { sx, sy } = board.whichBlock(occurrenceA.x, occurrenceA.y)
                        houseB = board.getBlock(sx, sy)
                    } else if(!houseA.isColumn() && board.isSameColumn(occurrenceA, occurrenceB) && board.isSameColumn(occurrenceA, occurrenceC)) {
                        houseB = board.getColumn(occurrenceA.x)
                    } else if(!houseA.isRow() && board.isSameRow(occurrenceA, occurrenceB) && board.isSameRow(occurrenceA, occurrenceC)) {
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
                            key: 'PointingTriple',
                            candidateHighlights: [
                                { x: occurrenceA.x, y: occurrenceA.y, candidates: [candidate] },
                                { x: occurrenceB.x, y: occurrenceB.y, candidates: [candidate] },
                                { x: occurrenceC.x, y: occurrenceC.y, candidates: [candidate] },
                            ],
                            candidateClearances,
                            foundValues: [],
                            targetHouse: houseA

                        }
                    }
                }
            }
        }
    }
}