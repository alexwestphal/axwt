
import * as React from 'react'

import {Button} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'

import {Sudoku} from '../data'
import {AppActions, BoardActions, selectEditBoard, useThunkDispatch, useTypedSelector} from '../store'

import SudokuBoard, {BoardCell, SudokuBoardProps} from './SudokuBoard'


import {mainPanelClasses} from './MainPanel'



const EditMode: React.FC = () => {

    const board = useTypedSelector(selectEditBoard, (left, right) => left.version == right.version)

    const dispatch = useThunkDispatch()

    const [activeCellCoord, setActiveCellCoord] = React.useState<Sudoku.Coord | null>(null)

    const handleClick: SudokuBoardProps['onClick'] = (ev) => {
        setActiveCellCoord({
            x: Math.floor(ev.boardX / (100/board.n2)),
            y: Math.floor(ev.boardY / (100/board.n2))
        })
    }

    const handeBlur = () => setActiveCellCoord(null)

    const handleKeyDown: React.KeyboardEventHandler = (ev) => {
        if(activeCellCoord == null) return
        let {x,y} = activeCellCoord
        if('1' <= ev.key && ev.key <= '9') {
            dispatch(BoardActions.setCellValue(x, y, parseInt(ev.key)))
        } else switch(ev.key) {
            case 'ArrowDown':
                if(y < board.n2-1) setActiveCellCoord({x: x, y: y+1})
                break
            case 'ArrowLeft':
                if(x > 0) setActiveCellCoord({x: x-1, y: y})
                break
            case 'ArrowRight':
                if(x < board.n2-1) setActiveCellCoord({x: x+1, y: y})
                break
            case 'ArrowUp':
                if(y > 0) setActiveCellCoord({ x: x, y: y-1})
                break
            case 'Backspace': {
                let activeCell = Sudoku.getCell(board, x, y)
                if(activeCell.value > 0) {
                    dispatch(BoardActions.clearCellValue(x, y))
                }
                break
            }
        }
    }

    return <>
        <SudokuBoard n={3} onClick={handleClick} onBlur={handeBlur} onKeyDown={handleKeyDown}>
            {board.cells.map(cell =>
                <BoardCell
                    key={`cell-${cell.x}-${cell.y}`}
                    n={board.n} x={cell.x} y={cell.y}
                    value={cell.value}
                    highlight={activeCellCoord != null && Sudoku.isSameCell(board, cell, activeCellCoord) ? 'active' : 'none'}
                />
            )}
        </SudokuBoard>
    </>
}

export default EditMode

export const EditModeControls: React.FC = () => {

    const dispatch = useThunkDispatch()

    return <>
        <Button
            className={mainPanelClasses.saveButton}
            variant="contained"
            endIcon={<SaveIcon/>}
            onClick={() => dispatch(AppActions.quickSave())}
        >Save</Button>
    </>
}