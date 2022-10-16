
import {ArrayUtils} from '@axwt/util'

export type BoardSize = 3 | 4

export type BoardType = 'Standard'

export type CellCoordinate = { x: number, y: number }

export type CellValueType = 'None' | 'Prefilled' | 'Guess' | 'Conflict' | 'Conflict-Prefilled'

export namespace BoardUtils {

    export const createCellCoordinateArray = (n: BoardSize): CellCoordinate[] =>
        ArrayUtils.range(0, n*n*n*n).map(i => ({ x: i % (n*n), y: Math.floor(i / (n*n)) }))

    export const isSameCell = (a: CellCoordinate, b: CellCoordinate): boolean => a.x == b.x && a.y == b.y

    export const isSameColumn = (a: CellCoordinate, b: CellCoordinate): boolean => a.x == b.x

    export const isSameRow = (a: CellCoordinate, b: CellCoordinate): boolean => a.y == b.y

    export const isSameHouse = (a: CellCoordinate, b: CellCoordinate, n: BoardSize): boolean =>
        Math.floor(a.x/n) == Math.floor(b.x/n) && Math.floor(a.y/n) == Math.floor(b.y/n)
}

