
import {Sudoku} from '../data'
import {SearchTechnique, SearchResult} from './SearchTechnique'

/**
 * A Naked-Single is a cell with a single remaining candidate. We thus know that it is the value for that cell.
 */
export class NakedSingleTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let cell of board.cells) {
            if(cell.candidates.length == 1) {
                // Found a naked single

                return {
                    key: 'NakedSingle',
                    candidateHighlights: [{ x: cell.x, y: cell.y, candidates: cell.candidates }],
                    candidateClearances: [],
                    foundValues: [{ x: cell.x, y: cell.y, value: cell.candidates[0] }]
                }
            }
        }
        return null
    }

}