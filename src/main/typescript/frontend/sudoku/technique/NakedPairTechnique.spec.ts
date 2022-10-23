
import {Sudoku} from '../data'

import { NakedPairTechnique } from './NakedPairTechnique'
import {SearchResult} from './SearchTechnique'

function runTest(board: Sudoku.Board): SearchResult {
    return new NakedPairTechnique().find(board)
}

test("empty board", () => {
    let result = runTest(Sudoku.empty3Board)
    expect(result).toBeNull()
})

test("already complete", () => {
    let result = runTest(Sudoku.filled3Board)
    expect(result).toBeNull()
})

test("AB, BC, AB", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2])
        .setCellCandidates(4, 1, [2,3])
        .setCellCandidates(5, 1, [1,2])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.key).toBe("NakedPair")
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,2] },
        { x: 5, y: 1, candidates: [1,2] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 4, y: 1, toClear: [2] }
    ])
    expect(result.targetHouse).toEqual(board.getBlock(1, 0))
})

