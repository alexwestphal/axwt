
import {Sudoku} from './Sudoku'

test("n = 3", () => {

    let board = new Sudoku.Board(3)
    expect(board.n).toBe(3)
    expect(board.n2).toBe(9)
    expect(board.n4).toBe(81)

    expect(board.cells).toHaveLength(81)
    expect(board.availableCandidates).toEqual([1,2,3,4,5,6,7,8,9])
})

test("n = 4", () => {

    let board = new Sudoku.Board(4)
    expect(board.n).toBe(4)
    expect(board.n2).toBe(16)
    expect(board.n4).toBe(256)

    expect(board.cells).toHaveLength(256)
    expect(board.availableCandidates).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])
})

test("getAllHouses", () => {
    let board = new Sudoku.Board(3)
    let result = board.getAllHouses()

    expect(result).toHaveLength(27)
})