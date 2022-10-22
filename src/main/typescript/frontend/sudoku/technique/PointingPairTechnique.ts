

import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'

export class PointingPairTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let houseA of board.getAllHouses()) {
            let candidates = board.getCandidatesInHouse(houseA)
            
            for(let {candidate, occurrences} of candidates) {
                if(occurrences.length == 2) {
                    // Is a pair
                    let [occurrenceA, occurrenceB] = occurrences.map(i => board.indexToCoord(i))

                    let houseB: Sudoku.House = null
                    if(houseA.houseType != 'Row' && board.isSameRow(occurrenceA, occurrenceB)) {
                        houseB = board.getRow(occurrenceA.y)
                    } else if(houseA.houseType != 'Column' && board.isSameColumn(occurrenceA, occurrenceB)) {
                        houseB = board.getColumn(occurrenceA.x)
                    } else if(houseA.houseType != 'Block' && board.isSameBlock(occurrenceA, occurrenceB)) {
                        let {sx, sy} = board.whichBlock(occurrenceA.x, occurrenceB.y)
                        houseB = board.getBlock(sx, sy)
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