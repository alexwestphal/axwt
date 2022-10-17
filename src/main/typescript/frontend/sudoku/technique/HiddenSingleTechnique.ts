
import {Sudoku} from '../data'
import {SearchTechnique, SearchResult} from './SearchTechnique'


export class HiddenSingleTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of Sudoku.getAllHouses(board)) {
            for(let candidate of Sudoku.availableCandidates(board)) {
                let foundInCell: Sudoku.Cell = null
                for(let cell of house.cells) {
                    if(cell.candidates.includes(candidate)) {
                        if(foundInCell) { // Already seen so too many
                            foundInCell = null
                            break
                        } else foundInCell = cell
                    }
                }
                if(foundInCell) {
                    return {
                        key: 'HiddenSingle',
                        candidateHighlights: [{ x: foundInCell.x, y: foundInCell.y, candidates: [candidate] }],
                        candidateClearances: [],
                        foundValues: [{ x: foundInCell.x, y: foundInCell.y, value: candidate }],
                        targetHouse: house
                    }
                }
            }
        }

        return null
    }
}