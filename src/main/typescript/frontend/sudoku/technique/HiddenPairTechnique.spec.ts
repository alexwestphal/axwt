
import {Sudoku} from '../data'

import { HiddenPairTechnique } from './HiddenPairTechnique'
import {SearchResult} from './SearchTechnique'

function runTest(board: Sudoku.Board): SearchResult {
    return new HiddenPairTechnique().find(board)
}

test("empty board", () => {
    let result = runTest(Sudoku.empty3Board)
    expect(result).toBeNull()
})

test("already complete", () => {
    let result = runTest(Sudoku.filled3Board)
    expect(result).toBeNull()
})

test("AB, AB", () => {
    // This is a naked pair, so nothing HiddenPair can do with it
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2])
        .setCellCandidates(4, 1, [1,2])
    let result = runTest(board)

    expect(result).toBeNull()
})

test("AB, ABC", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3,1, [1,3])
        .setCellCandidates(5, 1, [1,2,3])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,3] },
        { x: 5, y: 1, candidates: [1,3] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 5, y: 1, toClear: [2] }
    ])
})

test("AB, ABC, ABC", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3,1, [1,3])
        .setCellCandidates(4, 1, [1,2,3])
        .setCellCandidates(5, 1, [1,2,3])
    let result = runTest(board)

    expect(result).toBeNull()
})