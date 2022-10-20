
import * as React from 'react'

import {Box} from '@mui/material'

import {useInterval} from '@axwt/util'

import {Sudoku} from '../data'
import {selectEditBoard, selectSolveResult, selectSolveState, useTypedSelector} from '../store'

import SudokuBoard, {BoardCell} from './SudokuBoard'


const SolveMode: React.FC = () => {

    const initBoard = useTypedSelector(selectEditBoard, (left, right) => left.version == right.version)
    const solveState = useTypedSelector(selectSolveState)
    const result = useTypedSelector(selectSolveResult)


    const [stepIndex, setStepIndex] = React.useState<number>(0)
    const [currentBoard, setCurrentBoard] = React.useState<Sudoku.Board>(initBoard)

    useInterval(() => {
        switch(solveState.playback) {
            case 'Play':
                if(stepIndex < result.stepCount) {
                    // Advance to next step
                    let step = result.steps[stepIndex]
                    switch(step.type) {
                        case 'Wrong':
                            setCurrentBoard(Sudoku.setCellValueGuess(currentBoard, step.x, step.y, step.value, false))
                            break
                        case 'Guess':
                            setCurrentBoard(Sudoku.setCellValueGuess(currentBoard, step.x, step.y, step.value, false))
                            break
                        case 'Correct':
                            break
                        case 'Delete':
                            setCurrentBoard(Sudoku.clearCell(currentBoard, step.x, step.y, false))
                            break
                    }
                    setStepIndex(stepIndex+1)
                }
                break
            case 'Pause':
                // Do nothing
                break
            case 'Reset':
                if(stepIndex > 0) {
                    setStepIndex(0)
                    setCurrentBoard(initBoard)
                }
                break
        }
    }, 1000 / solveState.playbackSpeed)


    const displayedBoard = solveState.playback == 'Show' ? result.solution : currentBoard

    return <>
        <SudokuBoard n={displayedBoard.n}>
            {displayedBoard.cells.map(cell => {
                return <BoardCell
                    key={`cell-${cell.x}-${cell.y}`}
                    n={currentBoard.n} x={cell.x} y={cell.y}
                    value={cell.value}
                    valueType={cell.valueType}
                    highlight="none"
                />
            })}
        </SudokuBoard>
        {stepIndex > 1 && <Box textAlign="center">Step {stepIndex+1} of {result.stepCount}</Box>}
    </>
}

export default SolveMode

