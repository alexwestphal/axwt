import {ArrayUtils} from '@axwt/util'

import {Sudoku} from '../data/Sudoku'

export type SolveStrategy = 'brute-force'


export interface SolveStep {

    type: 'Wrong' | 'Guess' | 'Correct' | 'Delete'
    x: number
    y: number
    value: number
}

export interface SolveResult {
    success: boolean
    timeTaken: number
    stepCount: number
    solution: Sudoku.Board
    steps: SolveStep[]
}

export type SolveDirection = 'Forward' | 'Reverse' | 'Spiral' | 'LeastFilledHouse' | 'LeastCandidates'


export const createSolvePath = (board: Sudoku.Board, direction: SolveDirection): number[] => {
    let {n, n2, n4} = board
    switch(direction) {
        case 'Forward':
            return ArrayUtils.range(0, n4)
        case 'Reverse':
            return ArrayUtils.range(0, n4).reverse()
        case 'Spiral': {
            let result = new Array(n4 + 1)
            if (n % 2 == 0) { // n is even
                result[0] = n2 / 2 + (n2 / 2 - 1) * n2
                result[1] = result[0] + n2 // Down
                result[2] = result[1] - 1 // Left
                result[3] = result[2] - n2 // Up
                result[4] = result[3] - n2 // Up

                let i = 5, m = 2
                while (i < n4) {

                    for (let mi = 0; mi < m; mi++) { // Right
                        result[i] = result[i - 1] + 1
                        i++
                    }
                    for (let mi = 0; mi < m + 1; mi++) { // Down
                        result[i] = result[i - 1] + n2
                        i++
                    }
                    for (let mi = 0; mi < m + 1; mi++) { // Left
                        result[i] = result[i - 1] - 1
                        i++
                    }
                    for (let mi = 0; mi < m + 2; mi++) { // Up
                        result[i] = result[i - 1] - n2
                        i++
                    }

                    m += 2
                }

            } else { // n is odd
                result[0] = Math.floor(n4 / 2)
                result[1] = result[0] - n2 // Up

                let i = 2, m = 1
                while (i < n4) {

                    for (let mi = 0; mi < m; mi++) { // Right
                        result[i] = result[i - 1] + 1
                        i++
                    }
                    for (let mi = 0; mi < m + 1; mi++) { // Down
                        result[i] = result[i - 1] + n2
                        i++
                    }
                    for (let mi = 0; mi < m + 1; mi++) { // Left
                        result[i] = result[i - 1] - 1
                        i++
                    }
                    for (let mi = 0; mi < m + 2; mi++) { // Up
                        result[i] = result[i - 1] - n2
                        i++
                    }

                    m += 2
                }
            }
            return result.slice(0, n4)
        }
        case 'LeastFilledHouse': {
            let result = []

            let houses = board.getAllHouses()
            let emptyCounts = houses.map((house, houseIndex) =>
                [houseIndex, ArrayUtils.occurrences(house.cells.map(cell => cell.valueType), 'None')]
            ).sort(([ai, ac], [bi, bc]) => ac > bc ? 1 : ac < bc ? -1 : 0)

            for(let [index, count] of emptyCounts) {
                for(let cell of houses[index].cells) {
                    if(!result.includes(cell.index)) result.push(cell.index)
                }
            }
            return result
        }
        case 'LeastCandidates': {
            let buckets = [[], [], [], [], [], [], [], [], [], []]

            for(let cell of board.calculateCandidates().cells) {
                buckets[cell.candidates.length].push(cell.index)
            }

            return buckets.flat()
        }
    }
}