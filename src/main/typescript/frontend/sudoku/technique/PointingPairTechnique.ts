

import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'

export class PointingPairTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of Sudoku.getAllHouses(board)) {
            let candidates = Sudoku.getCandidatesInHouse(board, house)
            
            for(let {candidate, occurrences} of candidates) {
                if(occurrences.length == 2) {
                    // Is a pair
                    let [occurrenceA, occurrenceB] = occurrences.map(i => board.indexToCoord(i))

                    let clearingHouse: ReadonlyArray<Sudoku.Cell> = null
                    if(house.houseType != 'Row' && board.isSameRow(occurrenceA, occurrenceB)) {
                        clearingHouse = Sudoku.getRow(board, occurrenceA.y)
                    } else if(house.houseType != 'Column' && board.isSameColumn(occurrenceA, occurrenceB)) {
                        clearingHouse = Sudoku.getColumn(board, occurrenceA.x)
                    } else if(house.houseType != 'Block' && board.isSameBlock(occurrenceA, occurrenceB)) {
                        let {bx, by} = Sudoku.whichBlock(board, occurrenceA.x, occurrenceB.y)
                        clearingHouse = Sudoku.getBlock(board, bx, by)
                    }

                    let candidateClearances: CandidateClearances[] = []
                    if(null != clearingHouse) {
                        for(let cell of clearingHouse) {
                            if(cell.candidates.includes(candidate)) {
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
                            targetHouse: house

                        }
                    }
                }
            }
        }

       return null
    }
}