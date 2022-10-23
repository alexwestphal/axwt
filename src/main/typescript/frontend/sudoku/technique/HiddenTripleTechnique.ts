
import {Sudoku} from '../data'
import {CandidateClearances, SearchResult, SearchTechnique} from './SearchTechnique'
import {SetUtils} from '@axwt/util'

/**
 * A Hidden-Triple involves three candidates (in a particular house) that appear in only 3 different cells. This can
 * occur with all three candidates in all three cells or a combination of them. We can deduce that those three values
 * must occur in those three cells and therefore any other candidates can be removed from those cells.
 */
export class HiddenTripleTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of board.getAllHouses()) {
            let candidates = board.getCandidatesInHouse(house).filter(cwo => cwo.occurrences.length > 0 && cwo.occurrences.length <= 3)

            for(let i = 0; i < candidates.length-2; i++) {
                let cwoA = candidates[i]
                for(let j = i+1; j < candidates.length-1; j++) {
                    let cwoB = candidates[j]
                    let occurrencesAB = SetUtils.union(cwoA.occurrences, cwoB.occurrences)

                    if(occurrencesAB.length <= 3) {

                        for(let k = j+1; k < candidates.length; k++) {
                            let cwoC = candidates[k]
                            let occurrencesABC = SetUtils.union(occurrencesAB, cwoC.occurrences)

                            if(occurrencesABC.length == 3) {
                                // Found a hidden triple
                                let candidates = [cwoA.candidate, cwoB.candidate, cwoC.candidate]

                                let cells = occurrencesABC.map(occurrence => board.getCell(occurrence))
                                let candidateClearances: CandidateClearances[] = cells
                                    .map(cell => {
                                        return {
                                            x: cell.x, y: cell.y,
                                            toClear: SetUtils.difference(cell.candidates, candidates)
                                        }
                                    })
                                    .filter(cc => cc.toClear.length > 0)

                                if(candidateClearances.length > 0) {
                                    return {
                                        key: 'HiddenTriple',
                                        candidateHighlights: cells.map(cell => ({
                                            x: cell.x, y: cell.y, candidates: SetUtils.union(cell.candidates, candidates)
                                        })),
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
        }

        return null
    }
}