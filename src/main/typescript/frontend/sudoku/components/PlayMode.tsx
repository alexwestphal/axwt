
import * as React from 'react'

import {Box, Button, ButtonGroup, IconButton, Tooltip} from '@mui/material'
import {lightBlue, grey} from '@mui/material/colors'

import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'

import {createClasses} from '@axwt/util'


import {Sudoku} from '../data'
import {
    PlayActions,
    selectCurrentPlayBoard, selectEntryMode, selectGameStage,
    useThunkDispatch,
    useTypedSelector
} from '../store'


import SudokuBoard, {BoardCell, BoardCellProps, SudokuBoardProps} from './SudokuBoard'



const playModeClasses = createClasses('PlayMode', ['overlay'])

const PlayMode: React.FC = () => {

    const board = useTypedSelector(selectCurrentPlayBoard)
    const entryMode = useTypedSelector(selectEntryMode)
    const gameStage = useTypedSelector(selectGameStage)

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
        let activeCell = Sudoku.getCell(board, x, y)
        let isKnownCell = activeCell.valueType == 'Known' || activeCell.valueType == 'Known-Conflict'

        if('1' <= ev.key && ev.key <= '9' && !isKnownCell) {
            let value = parseInt(ev.key)
            if(entryMode == 'Normal') {
                dispatch(PlayActions.setCellValue(x, y, value))
            } else if(entryMode == 'Note') {
                dispatch(PlayActions.toggleNote(x, y, value))
            }
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
                if(!isKnownCell) {
                    dispatch(PlayActions.clearCell(x, y))
                }
                break
            }
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
        { gameStage == 'Init' && <>
            <SudokuBoard n={board.n}>
                {board.cells.map(cell =>
                    <BoardCell
                        key={`cell=${cell.x}-${cell.y}`}
                        n={board.n} x={cell.x} y={cell.y}
                        value={cell.value}
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
        { gameStage == 'Play' && <>
            <SudokuBoard n={board.n} onClick={handleClick} onBlur={handeBlur} onKeyDown={handleKeyDown}>
                {board.cells.map(cell => {

                    let highlight: BoardCellProps['highlight'] = 'none'
                    if(activeCellCoord != null) {
                        let activeCell = Sudoku.getCell(board, activeCellCoord.x, activeCellCoord.y)
                        if(Sudoku.isSameCell(board, cell, activeCellCoord)) highlight = 'active'
                        else if(
                            Sudoku.isSameColumn(board, cell, activeCell) ||
                            Sudoku.isSameRow(board, cell, activeCell) ||
                            Sudoku.isSameHouse(board, cell, activeCell)
                        ) highlight = 'indicate'
                        else if(cell.value > 0 && cell.value == activeCell.value)
                            highlight = 'match'
                    }

                    return <BoardCell
                        key={`cell=${cell.x}-${cell.y}`}
                        n={board.n} x={cell.x} y={cell.y}
                        value={cell.value}
                        valueType={cell.valueType}
                        highlight={highlight}
                        notes={cell.notes}
                    />
                })}
            </SudokuBoard>
        </>}
        { gameStage == 'Done' && <>

        </>}
    </Box>

}

export default PlayMode


export const PlayModeControls: React.FC = () => {

    const entryMode = useTypedSelector(selectEntryMode)
    const gameStage = useTypedSelector(selectGameStage)
    const dispatch = useThunkDispatch()

    let notesMode = entryMode == 'Note'

    return gameStage == 'Play' && <>
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