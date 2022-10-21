import {ArrayUtils} from '@axwt/util'


export namespace Sudoku {

    export class Board {

        readonly n: Sudoku.Size
        readonly n2: Sudoku.Size
        readonly n4: Sudoku.Size
        readonly cells: ReadonlyArray<Cell>

        readonly version: number
        readonly availableCandidates: ReadonlyArray<Sudoku.Value>
        readonly nRange: ReadonlyArray<IndexN>
        readonly n2Range: ReadonlyArray<IndexN2>

        constructor(n: number) {
            this.n = n
            this.n2 = n * n
            this.n4 = n * n * n * n
            this.cells = ArrayUtils.range(0, this.n4).map(index => ({
                index,
                x: index % this.n2,
                y: Math.floor(index/this.n2),
                value: 0,
                valueType: 'None',
                candidates: [],
                conflicts: []
            }))

            this.version = 1
            this.availableCandidates = ArrayUtils.range(1, this.n2+1)
            this.nRange = ArrayUtils.range(0, this.n)
            this.n2Range = ArrayUtils.range(0, this.n2)
        }

        indexToCoord(a: IndexN4): Coord {
            return {
                x: a % this.n2,
                y: Math.floor(a/this.n2)
            }
        }

        isSameColumn(a : IndexN4 | Coord, b: IndexN4 | Coord) {
            if(typeof a === 'number') a = this.indexToCoord(a)
            if(typeof b === 'number') b = this.indexToCoord(b)
            
            return a.x == b.x
        }

        isSameRow(a: IndexN4 | Coord, b: IndexN4 | Coord): boolean {
            if(typeof a === 'number') a = this.indexToCoord(a)
            if(typeof b === 'number') b = this.indexToCoord(b)

            return a.y == b.y
        }

        isSameBlock(a: IndexN4 | Coord, b: IndexN4 | Coord): boolean {
            if(typeof a === 'number') a = this.indexToCoord(a)
            if(typeof b === 'number') b = this.indexToCoord(b)
            return Math.floor(a.x/this.n) == Math.floor(b.x/this.n) && Math.floor(a.y/this.n) == Math.floor(b.y/this.n)
        }
    }

    export interface Coord {
        readonly x: IndexN2
        readonly y: IndexN2
    }

    export type CellValueType = 'None' | 'Known' | 'Known-Conflict' | 'User' | 'User-Conflict' | 'Guess' | 'Guess-Conflict'

    export interface Cell extends Coord {
        readonly index: Sudoku.IndexN4

        readonly value: Sudoku.Value
        readonly valueType: CellValueType
        readonly candidates: ReadonlyArray<Sudoku.Value>
        readonly conflicts: ReadonlyArray<Sudoku.IndexN4>
    }

    export interface HouseBase {
        readonly houseType: 'Column' | 'Row' | 'Block'
        readonly houseId: string
    }

    export interface Column extends HouseBase {
        readonly houseType: 'Column'
        readonly x: IndexN2
    }

    export interface Row extends HouseBase {
        readonly houseType: 'Row'
        readonly y: IndexN2
    }

    export interface Block extends HouseBase {
        readonly houseType: 'Block'
        readonly bx: IndexN
        readonly by: IndexN
    }

    export type House = Column | Row | Block
    export type HouseWithCells = House & { cells: ReadonlyArray<Sudoku.Cell>  }

    /**
     * Index in the range 0 to n
     */
    export type IndexN = number

    /**
     * Index in the range 0 to n2
     */
    export type IndexN2 = number

    /**
     * Index in the range 0 to n4
     */
    export type IndexN4 = number

    /**
     * A number representing a size (such as the board or block size)
     */
    export type Size = number

    /**
     * A values that a cell can be set to.
     * Range: 1 (inclusive) to n2 (inclusive)
     */
    export type Value = number


    // Board Creation

    export const fromValues = (blockSize: Sudoku.Size, values: Sudoku.Value[]): Sudoku.Board => {
        let n = blockSize, n2 = n*n, n4 = n2*n2
        if(n4 != values.length) throw new Error(`values.length (${values.length}) should be boardSize^4 (${n4})`)

        return updateCells(new Board(blockSize), cells => {
            for(let i=0; i<n4; i++) {
                cells[i] = { ...cells[i],
                    value: values[i] || 0,
                    valueType: values[i] > 0 ? 'Known' : 'None'
                }
            }
        })
    }

    // Data utilities

    export const isSameCell = (board: Sudoku.Board, a: Coord, b: Coord): boolean => a.x == b.x && a.y == b.y

    export const isSameColumn = (board: Sudoku.Board, a: Coord, b: Coord): boolean => a.x == b.x

    export const isSameRow = (board: Sudoku.Board, a: Coord, b: Coord): boolean => a.y == b.y

    export const isSameBlock = (board: Sudoku.Board, a: Coord, b: Coord): boolean =>
        Math.floor(a.x/board.n) == Math.floor(b.x/board.n) && Math.floor(a.y/board.n) == Math.floor(b.y/board.n)

    export const whichBlock = (board: Sudoku.Board, x: IndexN2, y: IndexN2): { bx: IndexN, by: IndexN } =>
        ({ bx: Math.floor(x/board.n), by: Math.floor(y/board.n) })



    // Caching

    let _cacheVersion = 0
    let _cache: Map<string, any>

    const cache = <T> (board: Sudoku.Board, key: string, produce: () => T): T => {
        if(board.version > _cacheVersion) {
            _cacheVersion = board.version
            _cache = new Map<string, any>()
        }

        if(_cache.has(key)) return _cache.get(key)
        else {
            let value = produce()
            _cache.set(key, value)
            return value
        }

    }



    // Accessors

    export const checkGuess = (board: Sudoku.Board, x: IndexN2, y: IndexN2, value: Value): boolean => {

        // Check rest of row
        for(let tx of board.n2Range) {
            if(tx != x && board.cells[tx + y * board.n2].value == value) return false
        }
        // Check rest of column
        for(let ty of board.n2Range) {
            if(ty != y && board.cells[x + ty * board.n2].value == value) return false
        }

        // Check rest of block
        let { bx, by } = whichBlock(board, x, y)
        for(let i of board.nRange) {
            for(let j of board.nRange) {
                let tx = bx * board.n + j
                let ty = by * board.n + i
                if(tx != x && ty != y && board.cells[tx + ty * board.n2].value == value) return false
            }
        }

        return true
    }

    export const getAllHouses = (board: Sudoku.Board): HouseWithCells[] =>
        cache(board, "getAllHouses", () => [...getBlocks(board), ...getColumns(board), ...getRows(board)])

    export const getBlock = (board: Sudoku.Board, bx: number, by: number): ReadonlyArray<Sudoku.Cell> => {
        let house = new Array<Sudoku.Cell>(board.n2)
        for(let yi of board.nRange) {
            for(let xi of board.nRange) {
                let x = bx * board.n + xi
                let y = by * board.n + yi
                house[xi + yi * board.n] = board.cells[x + y * board.n2]
            }
        }
        return house
    }

    export const getBlocks = (board: Sudoku.Board): (Sudoku.Block & { cells: ReadonlyArray<Sudoku.Cell> })[] =>
        cache(board, "getBlocks", () =>
            board.nRange.map(i => {
                let bx = i % board.n
                let by = Math.floor(i/board.n)
                return { houseType: 'Block', houseId: `Block-${bx}-${by}`, bx, by, cells: getBlock(board, bx, by) }
            })
        )

    export interface CandidateWithOccurrences {
        readonly candidate: Value
        readonly occurrences: IndexN4[]
    }

    export const getCandidatesInHouse = (board: Sudoku.Board, house: HouseWithCells): CandidateWithOccurrences[] =>
        cache(board, `getCandidatesInHouse-${house.houseId}`, () => {
            let result: CandidateWithOccurrences[] = board.availableCandidates.map(candidate => ({
                candidate, occurrences: []
            }))

            for (let cell of  house.cells) {
                for (let candidate of cell.candidates) {
                    result[candidate - 1].occurrences.push(cell.index)
                }
            }

            return result
        })

    export const getCell = (board: Sudoku.Board, x: IndexN2, y: IndexN2): Cell => board.cells[x + y * board.n2]

    export const getColumn = (board: Sudoku.Board, x: IndexN2): ReadonlyArray<Sudoku.Cell> => {
        let column = new Array<Sudoku.Cell>(board.n2)
        for(let y of board.n2Range) column[y] = board.cells[x + y * board.n2]
        return column
    }

    export const getColumns = (board: Sudoku.Board): (Sudoku.Column & { cells: ReadonlyArray<Sudoku.Cell> })[] =>
        cache(board, "getColumns", () =>
            board.n2Range.map(x => ({ houseType: 'Column', houseId: `Column-${x}`, x, cells: getColumn(board, x) }))
        )

    export const getRow = (board: Sudoku.Board, y: IndexN2): ReadonlyArray<Sudoku.Cell> => {
        let row = new Array<Sudoku.Cell>(board.n2)
        for(let x of board.n2Range) row[x] = board.cells[x + y * board.n2]
        return row
    }

    export const getRows = (board: Sudoku.Board): (Sudoku.Row & { cells: ReadonlyArray<Sudoku.Cell> })[] =>
        cache(board, "getRows", () =>
            board.n2Range.map(y => ({ houseType: 'Row', houseId: `Row-${y}`, y,  cells: getRow(board, y) }))
        )



    // Board Manipulation

    /**
     * Calculate the candidates for all currently empty cells
     * @param board
     */
    export const calculateCandidates = (board: Sudoku.Board): Sudoku.Board => updateCells(board, cells => {

        for(let y of board.n2Range) {
            for(let x of board.n2Range) {
                let cellIndex = x + y * board.n2
                let cell = cells[cellIndex]
                if(cell.valueType == 'None') {
                    let candidates = ArrayUtils.range(1, board.n2 + 1)

                    // Scan for values already in row
                    for (let xi of board.n2Range) {
                        let otherCell = cells[xi + y * board.n2]
                        if (otherCell.value > 0) ArrayUtils.remove(candidates, otherCell.value)
                    }
                    // Scan for values already in column
                    for (let yi of board.n2Range) {
                        let otherCell = cells[x + yi * board.n2]
                        if (otherCell.value > 0) ArrayUtils.remove(candidates, otherCell.value)
                    }
                    // Scan for values already in block
                    let { bx, by } = whichBlock(board, x, y)
                    for (let yi of board.nRange) {
                        for (let xi of board.nRange) {
                            let tx = bx * board.n + xi
                            let ty = by * board.n + yi
                            let otherCell = board.cells[tx + ty * board.n2]
                            if (otherCell.value > 0) ArrayUtils.remove(candidates, otherCell.value)
                        }
                    }

                    cells[cellIndex] = { ...cell, candidates: candidates }
                } else if(cell.candidates == null) {
                    cells[cellIndex] = { ...cell, candidates: [] }
                }
            }
        }
    })

    export const clearCell = (board: Sudoku.Board, x: IndexN2, y: IndexN2, checkConflicts: boolean = true): Sudoku.Board => {
        if(checkConflicts) {
            return updateCells(board, cells => {
                let cellIndex = x + y * board.n2
                let cell = cells[cellIndex]
                cells[cellIndex] = { ...cell, value: 0, valueType: 'None', candidates: [], conflicts: []}

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
            return updateCell(board, x, y, { value: 0, valueType: 'None', candidates: [] })
        }
    }

    export const clearCandidates = (board: Sudoku.Board): Sudoku.Board => {
        return updateCells(board, cells => {
            for(let cell of cells) {
                if(cell.candidates.length > 0) {
                    cells[cell.index] = { ...cell, candidates: [] }
                }
            }
        })
    }

    export const setCellCandidates = (board: Sudoku.Board, x: IndexN2, y: IndexN2, candidates: ReadonlyArray<Value>): Sudoku.Board =>
        updateCell(board, x, y, { candidates })

    export const setCellValueUser = (board: Sudoku.Board, x: IndexN2, y: IndexN2, value: Value): Sudoku.Board => {
        let cellIndex = x + y * board.n2
        let cell = board.cells[cellIndex]

        if(value == cell.value) return board // Answer hasn't changed

        let board1 = clearCell(board, x, y, true)


        return updateCells(board1, cells => {
            cell = cells[cellIndex]
            let conflicts: IndexN4[] = []

            // Scan for conflicts and clear candidates
            let cellsToCheck = [
                ...getRow(board1, y).filter(c => c.x != x),
                ...getColumn(board1, x).filter(c => c.y != y),
                ...getBlock(board1, Math.floor(x/board.n), Math.floor(y/board.n)).filter(c => c.x != x && c.y != y)
            ]
            for(let otherCell of cellsToCheck) {
                if(value == otherCell.value) {
                    conflicts.push(otherCell.index)

                    cells[otherCell.index] = { ...otherCell,
                        conflicts: [...otherCell.conflicts, cellIndex],
                        valueType: otherCell.valueType == 'Known' ? 'Known-Conflict' : 'User-Conflict',
                        candidates: otherCell.candidates.filter(i => i != cellIndex)
                    }
                } else if(otherCell.candidates.length > 0) {
                    cells[otherCell.index] = { ...otherCell, candidates: otherCell.candidates.filter(n => n != value) }
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



    export const setCellValueGuess = (board: Sudoku.Board, x: IndexN2, y: IndexN2, value: Value, valid: boolean = true): Sudoku.Board =>
        updateCell(board, x, y, (cell) => ({ value, valueType: valid ? 'Guess' : 'Guess-Conflict' }))

    export const setCellValueKnown = (board: Sudoku.Board, x: number, y: number, value: Value): Sudoku.Board =>
        updateCell(board, x, y, (cell) => ({ value, valueType: 'Known' }))

    export const toggleCellCandidate = (board: Sudoku.Board, x: number, y: number, candidate: Value): Sudoku.Board =>
        updateCell(board, x, y, (cell) => ({
            candidates: cell.candidates.includes(candidate) ? cell.candidates.filter(n => n != candidate) : [...cell.candidates, candidate]
        }))

    const updateCell = (board: Sudoku.Board, x: number, y: number, update: Partial<Cell> | ((cell: Cell) => Partial<Cell>)): Sudoku.Board =>
        updateCells(board, cells => {
            let cellIndex = x + y * board.n2
            let cell = cells[cellIndex]

            let partial = update instanceof Function ? update(cell) : update

            cells[cellIndex] = { ...cell, ...partial }
        })

    const updateCells = (board: Sudoku.Board, mutate: (cells: Cell[]) => void): Sudoku.Board => {

        let cells = [...board.cells]
        mutate(cells)

        return { ...board, version: board.version+1, cells }
    }

    export const withGuesses = (board: Sudoku.Board, guesses: number[]): Sudoku.Board => {

        let cells: ReadonlyArray<Sudoku.Cell> = board.cells.map((cell, cellIndex) =>
            cell.valueType == 'Known' ? cell : { ...cell, value: guesses[cellIndex], valueType: 'Guess' }
        )

        return { ...board, version: board.version+1, cells }
    }
}

