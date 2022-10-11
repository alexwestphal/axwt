
import * as React from 'react'

import {ArrayUtils, useInterval} from '@axwt/util'

import {selectBoardState, selectSolveResult, selectSolveState, useTypedSelector} from '../store'

import SudokuBoard, {BoardCell, BoardCellProps} from './SudokuBoard'
import {Box} from '@mui/material'

type CellData = [number, BoardCellProps['valueColor']]

const SolveMode: React.FC = () => {

    const board = useTypedSelector(selectBoardState)
    const solveState = useTypedSelector(selectSolveState)
    const result = useTypedSelector(selectSolveResult)

    const n = board.boardSize, n2 = n * n, n4 = n2 * n2

    const [stepIndex, setStepIndex] = React.useState<number>(0)
    const [boardState, setBoardState] = React.useState<CellData[]>(board.cellValues.map(v => [v, 'value']))

    const setCellState = (x: number, y: number, cell: CellData) => {
        let index = x + y * n2
        let left = boardState.slice(0, index), right = boardState.slice(index+1)
        let result = [...left, cell, ...right]
        setBoardState(result)
    }

    useInterval(() => {
        switch(solveState.playback) {
            case 'Play':
                if(stepIndex < result.stepCount) {
                    // Advance to next step
                    let step = result.steps[stepIndex]
                    switch(step.type) {
                        case 'Wrong':
                            setCellState(step.x, step.y, [step.value, 'wrong'])
                            break
                        case 'Guess':
                            setCellState(step.x, step.y, [step.value, 'guess'])
                            break
                        case 'Correct':
                            break
                        case 'Delete':
                            setCellState(step.x, step.y, [step.value, 'delete'])
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
                    setBoardState(board.cellValues.map(v => [v, 'value']))
                }
                break
        }
    }, 1000 / solveState.playbackSpeed)

    const cells = ArrayUtils.range(0, n4).map(i => [i%n2, Math.floor(i/n2)])

    const displayedState: CellData[] = solveState.playback == 'Show'
        ? ArrayUtils.range(0, n4).map(i =>
            board.cellValues[i] > 0 ? [board.cellValues[i], 'value'] : [result.solution[i], 'correct']
        )
        : boardState

    return <>
        <SudokuBoard n={n}>
            {cells.map(([x,y]) => {
                let index = x + y * n2
                return <BoardCell
                    key={`cell-${x}-${y}`}
                    n={n} x={x} y={y}
                    value={displayedState[index][0]}
                    highlight="none"
                    valueColor={displayedState[index][0] > 0 ? displayedState[index][1] : null}
                />
            })}
        </SudokuBoard>
        {stepIndex > 1 && <Box textAlign="center">Step {stepIndex+1} of {result.stepCount}</Box>}
    </>
}

export default SolveMode

