
import {Sudoku} from '../data'
import {SearchResult, SearchTechnique} from './SearchTechnique'


export class NakedQuadTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        return null
    }
}