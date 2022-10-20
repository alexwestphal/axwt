
import {ArrayUtils} from '@axwt/util'

import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'

export class HiddenPairTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of Sudoku.getAllHouses(board)) {
            let candidates = Sudoku.getCandidatesInHouse(board, house).filter(cwo => cwo.occurrences.length == 2)

            for(let i=0; i<candidates.length-1; i++) {
                for(let j=i+1; j<candidates.length; j++) {
                    // We have two candidates that appear exactly twice in the house
                    if(ArrayUtils.equals(candidates[i].occurrences, candidates[j].occurrences)) {
                        // Hidden Pair Found

                        let candidateA = candidates[i].candidate, candidateB = candidates[j].candidate
                        let [cellIndexA, cellIndexB] = candidates[i].occurrences
                        let cellA = house.cells.find(cell => cell.index == cellIndexA)
                        let cellB = house.cells.find(cell => cell.index == cellIndexB)

                        let candidateClearances: CandidateClearances[] = [cellA, cellB]
                            .map(cell => ({
                                x: cell.x, y: cell.y,
                                toClear: cell.candidates.filter(candidate => candidate != candidateA && candidate != candidateB)
                            }))
                            .filter(cc => cc.toClear.length > 0)

                        if(candidateClearances.length == 0) break

                        console.log("Hidden Pair found: ", candidates)

                        return {
                            key: 'HiddenPair',
                            candidateHighlights: [
                                { x: cellA.x, y: cellA.y, candidates: [candidateA, candidateB] },
                                { x: cellB.x, y: cellB.y, candidates: [candidateA, candidateB] },
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