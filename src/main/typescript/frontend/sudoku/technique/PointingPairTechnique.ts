
import {ArrayUtils} from '@axwt/util'

import {Sudoku} from '../data'
import {SearchTechnique, SearchResult, CandidateClearances} from './SearchTechnique'

export class PointingPairTechnique implements SearchTechnique {

    find(board: Sudoku.Board): SearchResult | null {

        for(let house of Sudoku.getAllHouses(board)) {
            let candidates = Sudoku.getCandidatesInHouse(board, house)

        }

       return null
    }
}