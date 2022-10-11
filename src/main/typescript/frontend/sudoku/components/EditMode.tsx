
import * as React from 'react'

import {BoardUtils, CellCoordinate} from '../data'
import {BoardActions, selectBoardState, useThunkDispatch, useTypedSelector} from '../store'

import SudokuBoard, {BoardCell, SudokuBoardProps} from './SudokuBoard'



const EditMode: React.FC = () => {

    const board = useTypedSelector(selectBoardState)
    const n = board.boardSize, n2 = n * n, n4 = n2 * n2

    const dispatch = useThunkDispatch()

    const [activeCell, setActiveCell] = React.useState<CellCoordinate | null>(null)

    const cells = BoardUtils.createCellCoordinateArray(n)

    const handleClick: SudokuBoardProps['onClick'] = (ev) => {
        setActiveCell({
            x: Math.floor(ev.boardX / (100/n2)),
            y: Math.floor(ev.boardY / (100/n2))
        })
    }

    const handleKeyDown: React.KeyboardEventHandler = (ev) => {
        if(activeCell == null) return
        let {x,y} = activeCell
        if('1' <= ev.key && ev.key <= '9') {
            dispatch(BoardActions.setCellValue(x, y, parseInt(ev.key)))
        } else switch(ev.key) {
            case 'ArrowDown':
                if(y < n2-1) setActiveCell({x: x, y: y+1})
                break
            case 'ArrowLeft':
                if(x > 0) setActiveCell({x: x-1, y: y})
                break
            case 'ArrowRight':
                if(x < n2-1) setActiveCell({x: x+1, y: y})
                break
            case 'ArrowUp':
                if(y > 0) setActiveCell({ x: x, y: y-1})
                break
            case 'Backspace':
                if(board.cellValues[x+y*n2] > 0) {
                    dispatch(BoardActions.clearCellValue(x, y))
                }
                break
        }
    }

    return <>
        <SudokuBoard n={3} onClick={handleClick} onKeyDown={handleKeyDown}>
            {cells.map((cell, index) =>
                <BoardCell
                    key={`cell-${cell.x}-${cell.y}`}
                    n={n} x={cell.x} y={cell.y}
                    value={board.cellValues[index]}
                    highlight={activeCell != null && BoardUtils.isSameCell(cell, activeCell) ? 'active' : 'none'}
                />
            )}
        </SudokuBoard>
    </>
}

export default EditMode