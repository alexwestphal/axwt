
import * as React from 'react'

import {Box, Button} from '@mui/material'

import {createClasses} from '@axwt/util'

import {
    PlayActions,
    selectBoardState,
    selectPlayState,
    useThunkDispatch,
    useTypedSelector
} from '../store'


import SudokuBoard, {BoardCell, BoardCellProps, SudokuBoardProps} from './SudokuBoard'
import {BoardUtils, CellCoordinate} from '@axwt/sudoku/data'

const playModeClasses = createClasses('PlayMode', ['overlay'])

const PlayMode: React.FC = () => {

    const board = useTypedSelector(selectBoardState)
    const playState = useTypedSelector(selectPlayState)
    const dispatch = useThunkDispatch()

    const n = board.boardSize, n2 = n * n, n4 = n2 * n2

    const [activeCellCoord, setActiveCellCoord] = React.useState<CellCoordinate | null>(null)

    const cellCoords = BoardUtils.createCellCoordinateArray(n)

    const handleClick: SudokuBoardProps['onClick'] = (ev) => {
        setActiveCellCoord({
            x: Math.floor(ev.boardX / (100/n2)),
            y: Math.floor(ev.boardY / (100/n2))
        })
    }

    const handleKeyDown: React.KeyboardEventHandler = (ev) => {
        if(activeCellCoord == null) return
        let {x,y} = activeCellCoord
        let isPredefinedCell = board.cellValues[x + y * n2] > 0
        if('1' <= ev.key && ev.key <= '9' && !isPredefinedCell) {
            dispatch(PlayActions.setCellValue(x, y, parseInt(ev.key)))
        } else switch(ev.key) {
            case 'ArrowDown':
                if(y < n2-1) setActiveCellCoord({x: x, y: y+1})
                break
            case 'ArrowLeft':
                if(x > 0) setActiveCellCoord({x: x-1, y: y})
                break
            case 'ArrowRight':
                if(x < n2-1) setActiveCellCoord({x: x+1, y: y})
                break
            case 'ArrowUp':
                if(y > 0) setActiveCellCoord({ x: x, y: y-1})
                break
            case 'Backspace':
                if(!isPredefinedCell) {
                    dispatch(PlayActions.clearCell(x, y))
                }
                break
        }
    }

    const classes = playModeClasses
    return <Box className={classes.root} sx={{
        position: 'relative',

        [`& .${classes.overlay}`]: {
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: "rgba(250, 250, 250, .8)",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }}>
        { playState.gameStage == 'Init' && <>
            <SudokuBoard n={n}>
                {cellCoords.map((cell, index) =>
                    <BoardCell
                        key={`cell=${cell.x}-${cell.y}`}
                        n={n} x={cell.x} y={cell.y}
                        value={board.cellValues[index]}
                        highlight="none"
                    />
                )}
            </SudokuBoard>
            <div className={classes.overlay}>
                <Button
                    variant="contained"
                    onClick={() => dispatch(PlayActions.startGame())}
                >Start Game</Button>
            </div>
        </> }
        { playState.gameStage == 'Play' && <>
            <SudokuBoard n={n} onClick={handleClick} onKeyDown={handleKeyDown}>
                {cellCoords.map((cellCoord, index) => {
                    let {x,y} = cellCoord
                    let cell = playState.cells[index]

                    let highlight: BoardCellProps['highlight'] = 'none'
                    if(activeCellCoord != null) {
                        let activeCell = playState.cells[activeCellCoord.x + activeCellCoord.y * n2]
                        if(BoardUtils.isSameCell(cellCoord, activeCellCoord)) highlight = 'active'
                        else if(
                            BoardUtils.isSameColumn(cellCoord, activeCellCoord) ||
                            BoardUtils.isSameRow(cellCoord, activeCellCoord) ||
                            BoardUtils.isSameSector(cellCoord, activeCellCoord, n)
                        ) highlight = 'indicate'
                        else if(cell.value > 0 && cell.value == activeCell.value)
                            highlight = 'match'
                    }

                    return <BoardCell
                        key={`cell=${x}-${y}`}
                        n={n} x={x} y={y}
                        value={cell.value}
                        valueColor={cell.prefilled ? 'value' : cell.valid ? 'guess' : 'wrong' }
                        highlight={highlight}

                    />
                })}
            </SudokuBoard>
        </>}
        { playState.gameStage == 'Done' && <>

        </>}
    </Box>

}

export default PlayMode