
import {Sudoku} from '../data'

import { HiddenSingleTechnique } from './HiddenSingleTechnique'
import {SearchResult} from './SearchTechnique'

function runTest(board: Sudoku.Board): SearchResult {
    return new HiddenSingleTechnique().find(board)
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
    // A naked single would normally be found by NakedSingleTechnique, but the definitions overlap slightly so if the
    // NakedSingleTechnique isn't run first, HiddenSingleTechnique should find it
    let board = Sudoku.filled3Board.setCellCandidates(4, 1, [2])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.key).toBe("HiddenSingle")
    expect(result.candidateHighlights).toEqual([{ x: 4, y: 1, candidates: [2] }])
    expect(result.candidateClearances).toEqual([])
    expect(result.foundValues).toEqual([{ x: 4, y: 1, value: 2 }])
    expect(result.targetHouse).toEqual(board.getBlock(1, 0))
})

test("hidden single", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1, 3])
        .setCellCandidates(4, 1, [1, 2, 3])
        .setCellCandidates(5, 1, [1, 3])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toEqual([{ x: 4, y: 1, candidates: [2] }])
    expect(result.candidateClearances).toEqual([])
    expect(result.foundValues).toEqual([{ x: 4, y: 1, value: 2 }])
    expect(result.targetHouse).toEqual(board.getBlock(1, 0))
})

test("multiple hidden singles", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1, 3])
        .setCellCandidates(4, 1, [1, 2, 3])
        .setCellCandidates(5, 1, [1, 3])
        .setCellCandidates(3, 2, [7, 8, 9])
        .setCellCandidates(4, 2, [7, 8])
        .setCellCandidates(5, 2, [7, 8])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toEqual([{ x: 4, y: 1, candidates: [2] }])
    expect(result.candidateClearances).toEqual([])
    expect(result.foundValues).toEqual([{ x: 4, y: 1, value: 2 }])
    expect(result.targetHouse).toEqual(board.getBlock(1, 0))
})