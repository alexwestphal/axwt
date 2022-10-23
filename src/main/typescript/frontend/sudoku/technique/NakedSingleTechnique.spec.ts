
import {Sudoku} from '../data'

import { NakedSingleTechnique } from './NakedSingleTechnique'
import {SearchResult} from './SearchTechnique'

function runTest(board: Sudoku.Board): SearchResult {
    return new NakedSingleTechnique().find(board)
}

test("empty board", () => {
    let result = runTest(Sudoku.empty3Board)
    expect(result).toBeNull()
})

test("already complete", () => {
    let result = runTest(Sudoku.filled3Board)
    expect(result).toBeNull()
})

test("naked single", () => {
    let board = Sudoku.filled3Board.setCellCandidates(4, 1, [2])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.key).toBe("NakedSingle")
    expect(result.candidateHighlights).toMatchObject([{ x: 4, y: 1, candidates: [2] }])
    expect(result.candidateClearances).toEqual([])
    expect(result.foundValues).toMatchObject([{ x: 4, y: 1, value: 2 }])
})

test("multiple naked singles", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(4, 1, [2])
        .setCellCandidates(5, 1, [3])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toEqual([{ x: 4, y: 1, candidates: [2] }])
    expect(result.candidateClearances).toEqual([])
    expect(result.foundValues).toEqual([{ x: 4, y: 1, value: 2 }])
})

test("hidden single", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1, 3])
        .setCellCandidates(4, 1, [1, 2, 3])
        .setCellCandidates(5, 1, [1, 3])
    let result = runTest(board)

    expect(result).toBeNull()
})