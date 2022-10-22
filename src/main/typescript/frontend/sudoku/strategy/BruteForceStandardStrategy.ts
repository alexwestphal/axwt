
import {createSolvePath, SolveResult, SolveStep, Sudoku} from '../data'
import {Strategy, StrategyConfig} from './Strategy'

export class BruteForceStandardStrategy implements Strategy {

    solve(board: Sudoku.Board, config: StrategyConfig): SolveResult {

        let startTime = Date.now()
        let success = true

        let known = board.cells.map(cell => cell.value > 0)
        let values = board.cells.map(cell => cell.value)
        let path = createSolvePath(config.direction, board.n)

        console.log("Values: ", values)

        const checkCell = (x: number, y: number, guess: number): boolean => {

            // Check if row already contains value
            for(let tx = 0; tx < board.n2; tx++) {
                if(tx != x && values[tx+y*board.n2] == guess) return false
            }

            // Check if column already contains value
            for(let ty = 0; ty < board.n2; ty++) {
                if(ty != y && values[x+ty*board.n2] == guess) return false
            }

            // Check if house already contains value
            let hx = Math.floor(x/board.n), hy = Math.floor(y/board.n)
            for(let i = 0; i < board.n; i++) {
                for(let j = 0; j < board.n; j++) {
                    let tx = hx*board.n + j
                    let ty = hy*board.n + i
                    if(tx != x && ty != y && values[tx+ty*board.n2] == guess) return false
                }
            }
            return true
        }
        const checkCellLog = (x: number, y: number, guess: number): boolean => {
            let result = checkCell(x, y, guess)
            console.debug(`checkCell(${x}, ${y}, ${guess}: ${result})`)
            return result
        }

        let steps: SolveStep[] = []

        let i = 0
        while(i < board.n4) {
            let j = path[i]

            if(known[j]) {
                // Prefilled value
                i++; continue
            }

            let x = j % board.n2, y = Math.floor(j / board.n2)

            let guess = values[j] + 1
            if(guess > board.n2) {

                // Need to backtrack (past any prefilled values)
                values[j] = 0
                do { i--; j = path[i] } while(known[j])

                steps.push({ type: 'Delete', x, y, value: 0})
            } else {
                values[j] = guess
                if(checkCellLog(x, y, guess)) {
                    // Possible value
                    steps.push({ type: 'Guess', x, y, value: guess })

                    i++ // Move on to next cell
                } else {
                    steps.push({ type: 'Wrong', x, y, value: guess })
                }
            }

            if(steps.length >= config.stepLimit) {
                success = false
                break
            }
        }

        let solution = board.withGuesses(values)

        let endTime = Date.now()
        let timeTaken = endTime - startTime

        return { success, timeTaken, steps, stepCount: steps.length, solution }
    }
}