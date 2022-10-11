
import {createSolvePath, SolveResult, SolveStep} from '../data'
import {Strategy, StrategyConfig} from './Strategy'

export class BruteForceStandardStrategy implements Strategy {

    solve(n: number, cellData: number[], config: StrategyConfig): SolveResult {

        let startTime = Date.now()
        let success = true

        let current = Array.from(cellData)
        let path = createSolvePath(config.direction, n)
        let n2 = n*n, n4 = n2*n2

        const checkCell = (x: number, y: number, guess: number): boolean => {

            // Check if row already contains value
            for(let tx = 0; tx < n2; tx++) {
                if(tx != x && current[tx+y*n2] == guess) return false
            }

            // Check if column already contains value
            for(let ty = 0; ty < n2; ty++) {
                if(ty != y && current[x+ty*n2] == guess) return false
            }

            // Check if section already contains value
            let sx = Math.floor(x/n), sy = Math.floor(y/n)
            for(let i = 0; i < n; i++) {
                for(let j = 0; j < n; j++) {
                    let tx = sx*n + j
                    let ty = sy*n + i
                    if(tx != x && ty != y && current[tx+ty*n2] == guess) return false
                }
            }
            return true
        }

        let steps: SolveStep[] = []

        let i = 0
        while(i < n4) {
            let j = path[i]

            if(cellData[j] != 0) {
                // Prefilled value
                i++; continue
            }

            let x = j % n2, y = Math.floor(j / n2)

            let guess = current[j] + 1
            if(guess > n2) {

                // Need to backtrack (past any prefilled values)
                current[j] = 0
                do { i--; j = path[i] } while(cellData[j] > 0)

                steps.push({ type: 'Delete', x, y, value: 0})
            } else {
                current[j] = guess
                if(checkCell(x, y, guess)) {
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

        let endTime = Date.now()
        let timeTaken = endTime - startTime

        return { success, timeTaken, steps, stepCount: steps.length, solution: current }
    }
}