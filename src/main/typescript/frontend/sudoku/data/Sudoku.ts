import {ArrayUtils} from '@axwt/util'


export namespace Sudoku {

    export class Board {

        readonly n: Sudoku.Size
        readonly n2: Sudoku.Size
        readonly n4: Sudoku.Size
        readonly cells: ReadonlyArray<Cell>

        readonly availableCandidates: ReadonlyArray<Sudoku.Value>

        constructor(n: number, cells: ReadonlyArray<Cell> = null) {
            this.n = n
            this.n2 = n * n
            this.n4 = n * n * n * n
            this.cells = cells || ArrayUtils.range(0, this.n4).map(index => ({
                index,
                x: index % this.n2,
                y: Math.floor(index / this.n2),
                value: 0,
                valueType: 'None',
                candidates: [],
                conflicts: []
            }))

            this.availableCandidates = ArrayUtils.range(1, this.n2 + 1)
        }

        // Caching

        private _cache: Map<string, any> = new Map()

        cache<T>(key: string, produce: () => T): T {
            if (this._cache.has(key)) return this._cache.get(key)
            else {
                let value = produce()
                this._cache.set(key, value)
                return value
            }

        }


        // Conversions

        coordToIndex(a: Coord): IndexN4 {
            return a.x + a.y * this.n2
        }

        indexToCoord(a: IndexN4): Coord {
            return {
                x: a % this.n2,
                y: Math.floor(a / this.n2)
            }
        }


        // Structure checking

        checkGuess(x: IndexN2, y: IndexN2, value: Value): boolean {

            // Check rest of row
            for (let tx=0; tx<this.n2; tx++) {
                if (tx != x && this.getCell(tx, y).value == value) return false
            }
            // Check rest of column
            for (let ty=0; ty<this.n2; ty++) {
                if (ty != y && this.getCell(x, ty).value == value) return false
            }

            // Check rest of block
            let {sx, sy} = this.whichBlock(x, y)
            for (let yi=0; yi<this.n; yi++) {
                for (let xi=0; xi<this.n; xi++) {
                    let tx = sx * this.n + xi
                    let ty = sy * this.n + yi
                    if (tx != x && ty != y && this.getCell(tx, ty).value == value) return false
                }
            }

            return true
        }

        isSameBlock(a: IndexN4 | Coord, b: IndexN4 | Coord): boolean {
            if (typeof a === 'number') a = this.indexToCoord(a)
            if (typeof b === 'number') b = this.indexToCoord(b)
            let sa = this.whichBlock(a.x, a.y)
            let sb = this.whichBlock(b.x, b.y)
            return sa.sx == sb.sx && sa.sy == sb.sy
        }

        isSameCell(a: IndexN4 | Coord, b: IndexN4 | Coord) {
            if (typeof a !== 'number') a = a.x + a.y * this.n2
            if (typeof b !== 'number') b = b.x + b.y * this.n2
            return a == b
        }

        isSameColumn(a: IndexN4 | Coord, b: IndexN4 | Coord) {
            if (typeof a === 'number') a = this.indexToCoord(a)
            if (typeof b === 'number') b = this.indexToCoord(b)

            return a.x == b.x
        }

        isSameRow(a: IndexN4 | Coord, b: IndexN4 | Coord): boolean {
            if (typeof a === 'number') a = this.indexToCoord(a)
            if (typeof b === 'number') b = this.indexToCoord(b)

            return a.y == b.y
        }

        whichBlock(x: IndexN2, y: IndexN2): { sx: IndexN, sy: IndexN } {
            return {sx: Math.floor(x / this.n), sy: Math.floor(y / this.n)}
        }


        // Accessors


        getAllHouses(): ReadonlyArray<Sudoku.House> {
            return this.cache("getAllHouses", () => [...this.getBlocks(), ...this.getColumns(), ...this.getRows()])
        }

        getBlock(sx: number, sy: number): Sudoku.Block {
            let cells = new Array<Sudoku.Cell>(this.n2)
            for (let yi = 0; yi < this.n; yi++) {
                for (let xi = 0; xi < this.n; xi++) {
                    let x = sx * this.n + xi
                    let y = sy * this.n + yi
                    cells[xi + yi * this.n] = this.getCell(x, y)
                }
            }
            return new Sudoku.Block(sx, sy, cells)
        }

        getBlocks(): ReadonlyArray<Sudoku.Block> {
            return this.cache("getBlocks", () => {
                let blocks = new Array<Sudoku.Block>(this.n2)

                for (let sy = 0; sy < this.n; sy++) {
                    for (let sx = 0; sx < this.n; sx++) {
                        blocks[sx + sy * this.n] = this.getBlock(sx, sy)
                    }
                }
                return blocks

            })
        }


        getCandidatesInHouse(house: House): CandidateWithOccurrences[] {
            return this.cache(`getCandidatesInHouse-${house.houseId}`, () => {
                let result: CandidateWithOccurrences[] = this.availableCandidates.map(candidate => ({
                    candidate, occurrences: []
                }))

                for (let cell of house.cells) {
                    for (let candidate of cell.candidates) {
                        result[candidate - 1].occurrences.push(cell.index)
                    }
                }

                return result
            })
        }

        getCell(x: IndexN2, y: IndexN2): Cell {
            return this.cells[x + y * this.n2]
        }

        getColumn(x: IndexN2): Sudoku.Column {
            let cells = new Array<Sudoku.Cell>(this.n2)
            for (let y = 0; y < this.n2; y++) cells[y] = this.getCell(x, y)
            return new Sudoku.Column(x, cells)
        }

        getColumns(): ReadonlyArray<Sudoku.Column> {
            return this.cache("getColumns", () => {
                let columns = new Array<Sudoku.Column>(this.n2)
                for(let x = 0; x < this.n2; x++) columns[x] = this.getColumn(x)
                return columns

            })
        }

        getRow(y: IndexN2): Sudoku.Row {
            let cells = new Array<Sudoku.Cell>(this.n2)
            for (let x=0; x < this.n2; x++) cells[x] = this.getCell(x, y)
            return new Sudoku.Row(y, cells)
        }

        getRows(): ReadonlyArray<Row> {
            return this.cache("getRows", () => {
                let rows = new Array<Sudoku.Row>(this.n2)
                for(let y = 0; y < this.n2; y++) rows[y] = this.getRow(y)
                return rows
            })
        }


        // Board Manipulation

        /**
         * Calculate the candidates for all currently empty cells
         */
        calculateCandidates(): Sudoku.Board {
            return this.updateCells(cells => {

                for(let y = 0; y < this.n2; y++) {
                    for(let x = 0; x < this.n2; x++) {
                        let cellIndex = x + y * this.n2
                        let cell = cells[cellIndex]
                        if(cell.valueType == 'None') {
                            let candidates = ArrayUtils.range(1, this.n2+1)

                            // Scan for values already in row
                            for (let tx = 0; tx < this.n2; tx++) {
                                let otherCell = this.getCell(tx, y)
                                if (otherCell.value > 0) ArrayUtils.remove(candidates, otherCell.value)
                            }
                            // Scan for values already in column
                            for (let ty = 0; ty < this.n2; ty++) {
                                let otherCell = this.getCell(x, ty)
                                if (otherCell.value > 0) ArrayUtils.remove(candidates, otherCell.value)
                            }
                            // Scan for values already in block
                            let { sx, sy } = this.whichBlock(x, y)
                            for (let yi=0; yi<this.n; yi++) {
                                for (let xi=0; xi<this.n; xi++) {
                                    let tx = sx * this.n + xi
                                    let ty = sy * this.n + yi
                                    let otherCell = this.getCell(tx, ty)
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
        }

        clearCell(x: IndexN2, y: IndexN2, checkConflicts: boolean = true): Sudoku.Board {
            if(checkConflicts) {
                return this.updateCells(cells => {
                    let cellIndex = x + y * this.n2
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
                return this.updateCell(x, y, { value: 0, valueType: 'None', candidates: [] })
            }
        }

        clearCandidates(): Sudoku.Board {
            return this.updateCells(cells => {
                for(let cell of cells) {
                    if(cell.candidates.length > 0) {
                        cells[cell.index] = { ...cell, candidates: [] }
                    }
                }
            })
        }

        setCellCandidates(x: IndexN2, y: IndexN2, candidates: ReadonlyArray<Value>): Sudoku.Board {
            return this.updateCell(x, y, {candidates})
        }

        setCellValueUser(x: IndexN2, y: IndexN2, value: Value): Sudoku.Board {
            let cellIndex = x + y * this.n2
            let cell = this.cells[cellIndex]

            if(value == cell.value) return this // Answer hasn't changed

            let board1 = this.clearCell(x, y, true)


            return board1.updateCells(cells => {
                cell = cells[cellIndex]
                let conflicts: IndexN4[] = []

                // Scan for conflicts and clear candidates
                let {sx, sy} = this.whichBlock(x, y)
                let cellsToCheck = [
                    ...board1.getRow(y).cells.filter(c => c.x != x),
                    ...board1.getColumn(x).cells.filter(c => c.y != y),
                    ...board1.getBlock(sx, sy).cells.filter(c => c.x != x && c.y != y)
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



        setCellValueGuess(x: IndexN2, y: IndexN2, value: Value, valid: boolean = true): Sudoku.Board {
            return this.updateCell(x, y, (cell) => ({value, valueType: valid ? 'Guess' : 'Guess-Conflict'}))
        }

        setCellValueKnown(x: number, y: number, value: Value): Sudoku.Board {
            return this.updateCell(x, y, (cell) => ({ value, valueType: 'Known' }))
        }


        toggleCellCandidate(x: number, y: number, candidate: Value): Sudoku.Board {
            return this.updateCell(x, y, (cell) => ({
                candidates: cell.candidates.includes(candidate) ? cell.candidates.filter(n => n != candidate) : [...cell.candidates, candidate]
            }))
        }

        updateCell(x: number, y: number, update: Partial<Cell> | ((cell: Cell) => Partial<Cell>)): Sudoku.Board {
            return this.updateCells(cells => {
                let cellIndex = x + y * this.n2
                let cell = cells[cellIndex]

                let partial = update instanceof Function ? update(cell) : update

                cells[cellIndex] = {...cell, ...partial}
            })
        }

        updateCells(mutate: (cells: Cell[]) => void): Sudoku.Board {

            let cells = [...this.cells]
            mutate(cells)

            return new Board(this.n, cells)
        }

        withGuesses(guesses: number[]): Sudoku.Board {

            let cells: ReadonlyArray<Sudoku.Cell> = this.cells.map((cell, cellIndex) =>
                cell.valueType == 'Known' ? cell : { ...cell, value: guesses[cellIndex], valueType: 'Guess' }
            )

            return new Board(this.n, cells)
        }
    }


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

    export abstract class House {
        readonly houseType: 'Column' | 'Row' | 'Block'
        readonly houseId: string

        readonly cells: ReadonlyArray<Sudoku.Cell>

        protected constructor(houseId: string, cells: ReadonlyArray<Sudoku.Cell>) {
            this.houseId = houseId
            this.cells = cells
        }

        contains(cell: Sudoku.Cell): boolean {
            for(let cellB of this.cells) {
                if(cell.index == cellB.index) return true
            }
            return false
        }

        isBlock(): this is Block { return this.houseType == 'Block'}
        isColumn(): this is Column { return this.houseType == 'Column' }
        isRow(): this is Row { return this.houseType == 'Row' }
    }

    export class Block extends House {
        readonly houseType = 'Block'
        readonly sx: IndexN
        readonly sy: IndexN

        constructor(bx: IndexN, by: IndexN, cells: ReadonlyArray<Sudoku.Cell>) {
            super(`Block-${bx}-${by}`, cells)
            this.sx = bx
            this.sy = by
        }
    }

    export class Column extends House {
        readonly houseType = 'Column'
        readonly x: IndexN2

        constructor(x: IndexN2, cells: ReadonlyArray<Sudoku.Cell>) {
            super(`Column-${x}`, cells)
            this.x = x
        }
    }

    export class Row extends House {
        readonly houseType = 'Row'
        readonly y: IndexN2

        constructor(y: IndexN2, cells: ReadonlyArray<Sudoku.Cell>) {
            super(`Row-${y}`, cells)
            this.y = y
        }
    }




    export interface CandidateWithOccurrences {
        readonly candidate: Value
        readonly occurrences: IndexN4[]
    }
}

