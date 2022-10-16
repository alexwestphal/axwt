import {ArrayUtils} from '@axwt/util'


export namespace Sudoku {

    export interface Board {
        readonly n: number
        readonly n2: number
        readonly n4: number
        readonly cells: ReadonlyArray<Sudoku.Cell>
    }

    export type CellValueType = 'None' | 'Known' | 'Known-Conflict' | 'User' | 'User-Conflict' | 'Guess'

    export interface Cell {
        readonly index: number
        readonly x: number
        readonly y: number

        readonly value: number
        readonly valueType: CellValueType
        readonly notes: ReadonlyArray<number>
        readonly conflicts: ReadonlyArray<number>
    }


    // Board Creation

    export const newBoard = (boardSize: number): Sudoku.Board => {
        let n = boardSize, n2 = n*n, n4 = n2*n2
        return {
            n, n2, n4,
            cells: ArrayUtils.range(0, n4).map(index => ({
                index,
                x: index % n2,
                y: Math.floor(index/n2),
                value: 0,
                valueType: 'None',
                notes: [],
                conflicts: []
            }))
        }
    }

    export const fromValues = (boardSize: number, values: number[]): Sudoku.Board => {
        let n = boardSize, n2 = n*n, n4 = n2*n2
        if(n4 != values.length) throw new Error(`values.length (${values.length}) should be boardSize^4 (${n4})`)

        return updateCells(newBoard(boardSize), cells => {
            for(let i=0; i<n4; i++) {
                cells[i] = { ...cells[i],
                    value: values[i] || 0,
                    valueType: values[i] > 0 ? 'Known' : 'None'
                }
            }
        })
    }


    // Board Manipulation

    /**
     * Calculate the notes for all currently empty cells
     * @param board
     */
    export const calculateNotes = (board: Sudoku.Board): Sudoku.Board => updateCells(board, cells => {

        for(let y=0; y < board.n2; y++) {
            for(let x = 0; x < board.n2; x++) {
                let cellIndex = x + y * board.n2
                let cell = cells[cellIndex]
                if(cell.valueType == 'None') {
                    let notes = ArrayUtils.range(1, board.n2 + 1)

                    // Scan for values already in row
                    for (let xi = 0; xi < board.n2; xi++) {
                        let otherCell = cells[xi + y * board.n2]
                        if (otherCell.value > 0) ArrayUtils.remove(notes, otherCell.value)
                    }
                    //Scan for values already in column
                    for (let yi = 0; yi < board.n2; yi++) {
                        let otherCell = cells[x + yi * board.n2]
                        if (otherCell.value > 0) ArrayUtils.remove(notes, otherCell.value)
                    }
                    // Scan for values already in house
                    let hx = Math.floor(x / board.n), hy = Math.floor(y / board.n)
                    for (let yi = 0; yi < board.n; yi++) {
                        for (let xi = 0; xi < board.n; xi++) {
                            let tx = hx * board.n + xi
                            let ty = hy * board.n + yi
                            let otherCell = board.cells[tx + ty * board.n2]
                            if (otherCell.value > 0) ArrayUtils.remove(notes, otherCell.value)
                        }
                    }

                    cells[cellIndex] = { ...cell, notes }
                }
            }
        }
    })

    export const checkGuess = (board: Sudoku.Board, x: number, y: number, value: number): boolean => {

        // Check rest of row
        for(let xi=0; xi<board.n2; xi++) {
            if(xi != x && board.cells[xi + y * board.n2].value == value) return false
        }
        // Check rest of column
        for(let yi=0; yi<board.n2; yi++) {
            if(yi != y && board.cells[x + yi * board.n2].value == value) return false
        }

        // Check rest of house
        let hx = Math.floor(x/board.n), hy = Math.floor(y/board.n)
        for(let i=0; i < board.n; i++) {
            for(let j = 0; j < board.n; j++) {
                let tx = hx * board.n + j
                let ty = hy * board.n + i
                if(tx != x && ty != y && board.cells[tx + ty * board.n2].value == value) return false
            }
        }

        return true
    }

    export const clearCell = (board: Sudoku.Board, x: number, y: number, checkConflicts: boolean): Sudoku.Board => {
        if(checkConflicts) {
            return updateCells(board, cells => {
                let cellIndex = x + y * board.n2
                let cell = cells[cellIndex]
                cells[cellIndex] = { ...cell, value: 0, valueType: 'None', notes: [], conflicts: []}

                // Clear the conflicts from the other cells
                for(let ci of cell.conflicts) {
                    let otherCell = cells[ci]
                    let conflicts = otherCell.conflicts.filter(c => c != cellIndex)
                    let valueType = otherCell.valueType
                    if(conflicts.length == 0) {
                        if(valueType == 'Known-Conflict') valueType = 'Known'
                        else if(valueType == 'User-Conflict') valueType = 'User'
                    }
                    cells[ci] = { ...otherCell, conflicts, valueType }
                }
            })
        } else {
            return updateCell(board, x, y, cell => ({ value: 0, valueType: 'None', notes: [] }))
        }
    }

    export const getCell = (board: Sudoku.Board, x: number, y: number): Cell => board.cells[x + y * board.n2]

    export const getColumn = (board: Sudoku.Board, x: number): ReadonlyArray<Sudoku.Cell> => {
        let column = new Array<Sudoku.Cell>(board.n2)
        for(let y=0; y<board.n2; y++) column[y] = board.cells[x + y * board.n2]
        return column
    }

    export const getHouse = (board: Sudoku.Board, hx: number, hy: number): ReadonlyArray<Sudoku.Cell> => {
        let house = new Array<Sudoku.Cell>(board.n2)
        for(let yi=0; yi<board.n; yi++) {
            for(let xi=0; xi<board.n; xi++) {
                let x = hx * board.n + xi
                let y = hy * board.n + yi
                house[xi + yi * board.n] = board.cells[x + y * board.n2]
            }
        }
        return house
    }

    export const getRow = (board: Sudoku.Board, y: number): ReadonlyArray<Sudoku.Cell> => {
        let row = new Array<Sudoku.Cell>(board.n2)
        for(let x=0; x<board.n2; x++) row[x] = board.cells[x + y * board.n2]
        return row
    }

    export const setCellValueUser = (board: Sudoku.Board, x: number, y: number, value: number): Sudoku.Board => {
        let cellIndex = x + y * board.n2
        let cell = board.cells[cellIndex]

        if(value == cell.value) return board // Answer hasn't changed

        let board1 = clearCell(board, x, y, true)


        return updateCells(board1, cells => {
            cell = cells[cellIndex]
            let conflicts: number[] = []

            // Scan for conflicts and clear notes
            let cellsToCheck = [
                ...getRow(board1, y).filter(c => c.x != x),
                ...getColumn(board1, x).filter(c => c.y != y),
                ...getHouse(board1, Math.floor(x/board.n), Math.floor(y/board.n)).filter(c => c.x != x && c.y != y)
            ]
            for(let otherCell of cellsToCheck) {
                if(value == otherCell.value) {
                    conflicts.push(otherCell.index)

                    cells[otherCell.index] = { ...otherCell,
                        conflicts: [...otherCell.conflicts, cellIndex],
                        valueType: otherCell.valueType == 'Known' ? 'Known-Conflict' : 'User-Conflict',
                        notes: otherCell.notes.filter(i => i != cellIndex)
                    }
                } else if(otherCell.notes.length > 0) {
                    cells[otherCell.index] = { ...otherCell, notes: otherCell.notes.filter(i => i != cellIndex) }
                }
            }

            // Update the current cell
            cells[cellIndex] = { ...cell,
                value,
                valueType: conflicts.length > 0 ? 'User-Conflict' : 'User',
                conflicts
            }
        })
    }



    export const setCellValueGuess = (board: Sudoku.Board, x: number, y: number, value: number): Sudoku.Board =>
        updateCell(board, x, y, (cell) => ({ value, valueType: 'Guess' }))

    export const setCellValueKnown = (board: Sudoku.Board, x: number, y: number, value: number): Sudoku.Board =>
        updateCell(board, x, y, (cell) => ({ value, valueType: 'Known' }))

    export const setCellNotes = (board: Sudoku.Board, x: number, y: number, notes: number[]): Sudoku.Board =>
        updateCell(board, x, y, (cell) => ({ notes }))

    export const toggleCellNote = (board: Sudoku.Board, x: number, y: number, note: number): Sudoku.Board =>
        updateCell(board, x, y, (cell) => ({
            notes: cell.notes.includes(note) ? [...cell.notes, note] : cell.notes.filter(n => n != note)
        }))

    const updateCell = (board: Sudoku.Board, x: number, y: number, update: (cell: Cell) => Partial<Cell>): Sudoku.Board =>
        updateCells(board, cells => {
            let cellIndex = x + y * board.n2
            let cell = cells[cellIndex]
            cells[cellIndex] = { ...cell, ...update(cell) }
        })

    const updateCells = (board: Sudoku.Board, mutate: (cells: Cell[]) => void): Sudoku.Board => {

        let cells = [...board.cells]
        mutate(cells)

        return { ...board, cells }
    }
}

