
import {ArrayUtils} from '@axwt/util'

export type BoardSize = 3 | 4

export type BoardType = 'Standard'

export type CellCoordinate = { x: number, y: number }

export namespace BoardUtils {

    export const createCellCoordinateArray = (n: BoardSize): CellCoordinate[] =>
        ArrayUtils.range(0, n*n*n*n).map(i => ({ x: i % (n*n), y: Math.floor(i / (n*n)) }))

    export const isSameCell = (a: CellCoordinate, b: CellCoordinate): boolean => a.x == b.x && a.y == b.y

}

