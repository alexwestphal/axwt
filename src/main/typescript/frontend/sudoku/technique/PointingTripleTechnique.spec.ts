
import {Sudoku} from '../data'

import { PointingTripleTechnique } from './PointingTripleTechnique'
import {SearchResult} from './SearchTechnique'

function runTest(board: Sudoku.Board): SearchResult {
    return new PointingTripleTechnique().find(board)
}

test("empty board", () => {
    let result = runTest(Sudoku.empty3Board)
    expect(result).toBeNull()
})

test("already complete", () => {
    let result = runTest(Sudoku.filled3Board)
    expect(result).toBeNull()
})