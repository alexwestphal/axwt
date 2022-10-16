
import * as React from 'react'

import {Box, Button, ButtonGroup, IconButton, Tooltip} from '@mui/material'
import {lightBlue, grey} from '@mui/material/colors'

import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'

import {createClasses} from '@axwt/util'


import {BoardUtils, CellCoordinate} from '../data'
import {
    PlayActions,
    selectBoardState,
    selectPlayState,
    useThunkDispatch,
    useTypedSelector
} from '../store'


import SudokuBoard, {BoardCell, BoardCellProps, SudokuBoardProps} from './SudokuBoard'



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

    const handeBlur = () => setActiveCellCoord(null)

    const handleKeyDown: React.KeyboardEventHandler = (ev) => {
        if(activeCellCoord == null) return
        let {x,y} = activeCellCoord
        let isPredefinedCell = board.cellValues[x + y * n2] > 0
        if('1' <= ev.key && ev.key <= '9' && !isPredefinedCell) {
            let value = parseInt(ev.key)
            if(playState.entryMode == 'Normal') {
                dispatch(PlayActions.setCellValue(x, y, value))
            } else if(playState.entryMode == 'Note') {
                dispatch(PlayActions.toggleNote(x, y, value))
            }
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
            <SudokuBoard n={n} onClick={handleClick} onBlur={handeBlur} onKeyDown={handleKeyDown}>
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
                            BoardUtils.isSameHouse(cellCoord, activeCellCoord, n)
                        ) highlight = 'indicate'
                        else if(cell.value > 0 && cell.value == activeCell.value)
                            highlight = 'match'
                    }

                    return <BoardCell
                        key={`cell=${x}-${y}`}
                        n={n} x={x} y={y}
                        value={cell.value}
                        valueType={cell.valueType}
                        highlight={highlight}
                        notes={cell.notes}
                    />
                })}
            </SudokuBoard>
        </>}
        { playState.gameStage == 'Done' && <>

        </>}
    </Box>

}

export default PlayMode


export const PlayModeControls: React.FC = () => {

    const playState = useTypedSelector(selectPlayState)
    const dispatch = useThunkDispatch()

    let notesMode = playState.entryMode == 'Note'

    return playState.gameStage == 'Play' && <>
        <ButtonGroup>
            <Tooltip title="Compute Notes">
                <IconButton onClick={() => dispatch(PlayActions.generateNotes())}>
                    <AutoFixNormalIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Notes Mode">
                <IconButton
                    onClick={() => dispatch(PlayActions.setEntryMode(notesMode ? 'Normal' : 'Note'))}
                    sx={{ color: notesMode ? lightBlue[500] : grey[500] }}
                >
                    {notesMode ? <EditIcon/> : <EditOffIcon/>}
                </IconButton>
            </Tooltip>
        </ButtonGroup>

        <ButtonGroup>
            <IconButton>
                <UndoIcon/>
            </IconButton>
            <IconButton>
                <RedoIcon/>
            </IconButton>
        </ButtonGroup>
    </>
}