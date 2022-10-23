
import {Sudoku} from '../data'

import { HiddenSingleTechnique } from './HiddenSingleTechnique'

test("already complete", () => {
    let board = Sudoku.filled3Board

    let result = new HiddenSingleTechnique().find(board)

    expect(result).toBe(null)
})