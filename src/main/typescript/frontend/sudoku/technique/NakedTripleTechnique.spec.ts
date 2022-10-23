
import {Sudoku} from '../data'

import { NakedTripleTechnique } from './NakedTripleTechnique'
import {SearchResult} from './SearchTechnique'

function runTest(board: Sudoku.Board): SearchResult {
    return new NakedTripleTechnique().find(board)
}

test("empty board", () => {
    let result = runTest(Sudoku.empty3Board)
    expect(result).toBeNull()
})

test("already complete", () => {
    let result = runTest(Sudoku.filled3Board)
    expect(result).toBeNull()
})

test("ABC, ABC, ABC", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2,3])
        .setCellCandidates(4, 1, [1,2,3])
        .setCellCandidates(5, 1, [1,2,3])
    let result = runTest(board)

    // While a naked triple exists, nothing useful can be done with it
    expect(result).toBeNull()
})

test("ABC, ABC, ABC, ABCD", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2,3])
        .setCellCandidates(4, 1, [1,2,3])
        .setCellCandidates(5, 1, [1,2,3])
        .setCellCandidates(4, 2, [1,2,8])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.key).toBe("NakedTriple")
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,2,3] },
        { x: 4, y: 1, candidates: [1,2,3] },
        { x: 5, y: 1, candidates: [1,2,3] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 4, y: 2, toClear: [1,2] }
    ])
    expect(result.foundValues).toHaveLength(0)
    expect(result.targetHouse).toEqual(board.getBlock(1, 0))
})

test("ABC, ABC, AB, AD", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2,3])
        .setCellCandidates(4, 1, [1,2,3])
        .setCellCandidates(5, 1, [1,2])
        .setCellCandidates(7, 1, [1,5])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,2,3] },
        { x: 4, y: 1, candidates: [1,2,3] },
        { x: 5, y: 1, candidates: [1,2] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 7, y: 1, toClear: [1] }
    ])
    expect(result.targetHouse).toEqual(board.getRow(1))
})

test("ABC, AB, AB, CD", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2,3])
        .setCellCandidates(4, 1, [1,2])
        .setCellCandidates(5, 1, [1,2])
        .setCellCandidates(4, 2, [3,8])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,2,3] },
        { x: 4, y: 1, candidates: [1,2] },
        { x: 5, y: 1, candidates: [1,2] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 4, y: 2, toClear: [3] }
    ])
})

test("ABC, AB, BC, BD", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2,3])
        .setCellCandidates(4, 1, [1,2])
        .setCellCandidates(5, 1, [2,3])
        .setCellCandidates(4, 2, [2,8])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,2,3] },
        { x: 4, y: 1, candidates: [1,2] },
        { x: 5, y: 1, candidates: [2,3] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 4, y: 2, toClear: [2] }
    ])
})

test("BC, AB, ABC, BCD", () => { // Isomorphic to "ABC, AB, BC, BD"
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [2,3])
        .setCellCandidates(4, 1, [1,2])
        .setCellCandidates(5, 1, [1,2,3])
        .setCellCandidates(4, 2, [2,3,8])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 5, y: 1, candidates: [1,2,3] },
        { x: 3, y: 1, candidates: [2,3] },
        { x: 4, y: 1, candidates: [1,2] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 4, y: 2, toClear: [2,3] }
    ])
})

test("AB, AC, BC, AD", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2])
        .setCellCandidates(4, 1, [1,3])
        .setCellCandidates(5, 1, [2,3])
        .setCellCandidates(4, 2, [1,8])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,2] },
        { x: 4, y: 1, candidates: [1,3] },
        { x: 5, y: 1, candidates: [2,3] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 4, y: 2, toClear: [1] }
    ])
})

test("AB, AB, CD, BC", () => {
    let board = Sudoku.filled3Board
        .setCellCandidates(3, 1, [1,2])
        .setCellCandidates(4, 1, [1,2])
        .setCellCandidates(5, 1, [3,8])
        .setCellCandidates(4, 2, [2,3])
    let result = runTest(board)

    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 3, y: 1, candidates: [1,2] },
        { x: 4, y: 1, candidates: [1,2] },
        { x: 4, y: 2, candidates: [2,3] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 5, y: 1, toClear: [3] }
    ])
})