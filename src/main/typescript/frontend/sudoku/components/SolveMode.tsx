
import * as React from 'react'

import {Box} from '@mui/material'

import {useInterval} from '@axwt/util'

import {Sudoku} from '../data'
import {selectEditBoard, selectSolveResult, selectSolveState, useTypedSelector} from '../store'

import {mainPanelClasses} from './MainPanel'
import SudokuBoard, {BoardCell} from './SudokuBoard'


const SolveMode: React.FC = () => {

    const initBoard = useTypedSelector(selectEditBoard)
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
                            setCurrentBoard(currentBoard.setCellValueGuess(step.x, step.y, step.value, false))
                            break
                        case 'Guess':
                            setCurrentBoard(currentBoard.setCellValueGuess(step.x, step.y, step.value, true))
                            break
                        case 'Correct':
                            break
                        case 'Delete':
                            setCurrentBoard(currentBoard.clearCell(step.x, step.y, false))
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
        <div className={mainPanelClasses.controls}></div>
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
        <div className={mainPanelClasses.controls}>
            <div className={mainPanelClasses.controlsSpacer}></div>
            {stepIndex > 0 && <div>Step {stepIndex} of {result.stepCount}</div>}
            <div className={mainPanelClasses.controlsSpacer}></div>
        </div>
    </>
}

export default SolveMode

