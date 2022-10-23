
import {Sudoku} from '../data'

import { PointingPairTechnique } from './PointingPairTechnique'
import {SearchResult} from './SearchTechnique'

function runTest(board: Sudoku.Board): SearchResult {
    return new PointingPairTechnique().find(board)
}

test("empty board", () => {
    let result = runTest(Sudoku.empty3Board)
    expect(result).toBeNull()
})

test("already complete", () => {
    let result = runTest(Sudoku.filled3Board)
    expect(result).toBeNull()
})

test("unusable", () => {
    // A valid pointing pair but there are no candidates that can be cleared from it
    let board = Sudoku.empty3Board
        .setBlockCandidates(1, 0, [
            [4,6],  [2,5],  [4,6],
            1,      [2,5],  3,
            7,      8,      9,
        ])
        .setBlockCandidates(1, 1, [
            3,      [1,4],  5,
            9,      [1,4],  2,
            6,      7,      8
        ])
    let result = runTest(board)
    expect(result).toBeNull()
})

test("block / column", () => {
    let board = Sudoku.empty3Board
        .setBlockCandidates(1, 0, [
            [4,6],  [2,5],  [4,6],
            1,      [2,5],  3,
            7,      8,      9,
        ])
        .setBlockCandidates(1, 1, [
            3,      [1,2,4],5,
            9,      [1,4],  2,
            6,      7,      8
        ])

    let result = runTest(board)
    expect(result).not.toBeNull()
    expect(result.key).toBe("PointingPair")
    expect(result.candidateHighlights).toMatchObject([
        { x: 4, y: 0, candidates: [2] },
        { x: 4, y: 1, candidates: [2] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 4, y: 3, toClear: [2] }
    ])
    expect(result.targetHouse).toEqual(board.getBlock(1, 0))
})

test("block / row", () => {
    let board = Sudoku.empty3Board
        .setBlockCandidates(1, 0, [
            4,      5,      6,
            1,      [2,3],  [2,3],
            7,      8,      9,
        ])
        .setBlockCandidates(2, 0, [
            7,      [8,5,2],9,
            4,      [8,5,2],6,
            1,      [8,5,2],3,
        ])

    let result = runTest(board)
    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 4, y: 1, candidates: [2] },
        { x: 5, y: 1, candidates: [2] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 7, y: 1, toClear: [2] }
    ])
    expect(result.targetHouse).toEqual(board.getBlock(1, 0))
})

test("column / block", () => {
    let board = Sudoku.empty3Board
        .setBlockCandidates(1, 0, [
            4,      [2,5],  6,
            [1,2],  [2,5],  3,
            7,      8,      9,
        ])
        .setBlockCandidates(1, 1, [
            3,      4,      5,
            [1,2,9],1,      2,
            6,      7,      8,
        ])

    let result = runTest(board)
    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 4, y: 0, candidates: [2] },
        { x: 4, y: 1, candidates: [2] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 3, y: 1, toClear: [2] }
    ])
    expect(result.targetHouse).toEqual(board.getColumn(4))
})

test("row / block", () => {
    let board = Sudoku.empty3Board
        .setBlockCandidates(1, 0, [
            4,      5,      6,
            1,      [2,3],  [2,3],
            [3,7],  8,      9,
        ])

    let result = runTest(board)
    expect(result).not.toBeNull()
    expect(result.candidateHighlights).toMatchObject([
        { x: 4, y: 1, candidates: [3] },
        { x: 5, y: 1, candidates: [3] },
    ])
    expect(result.candidateClearances).toMatchObject([
        { x: 3, y: 2, toClear: [3] }
    ])
    expect(result.targetHouse).toEqual(board.getRow(1))
})