
import {Sudoku} from '../data'
import {SearchTechnique, SearchResult} from './SearchTechnique'


export class HiddenSingleTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        let spaces = [
            ...Sudoku.getColumns(board),
            ...Sudoku.getRows(board),
            ...Sudoku.getBlocks(board),
        ]

        for(let space of spaces) {
            for(let candidate = 1; candidate <= board.n2; candidate++) {
                let foundInCell: Sudoku.Cell = null
                for(let cell of space.cells) {
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
                        targetSpace: space
                    }
                }
            }
        }

        return null
    }
}