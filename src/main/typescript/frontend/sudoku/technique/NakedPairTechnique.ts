
import {ArrayUtils} from '@axwt/util'

import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'


export class NakedPairTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of board.getAllHouses()) {
            for(let i=0; i<board.n2-1;i++) {
                let cellA = house.cells[i]
                if(cellA.candidates.length == 2) {
                    // Potential a naked pair
                    for(let j=i+1; j<board.n2; j++) {
                        let cellB = house.cells[j]
                        if(ArrayUtils.equals(cellA.candidates, cellB.candidates)) {
                            // Naked pair found

                            let candidateClearances: CandidateClearances[] = house.cells
                                .filter(cell => cell.index != cellA.index && cell.index != cellB.index)
                                .map(cell => ({
                                    x: cell.x, y: cell.y,
                                    toClear: cell.candidates.filter(candidate => cellA.candidates.includes(candidate))
                                }))
                                .filter(cc => cc.toClear.length > 0)

                            if(candidateClearances.length == 0) break

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

        return null
    }
}