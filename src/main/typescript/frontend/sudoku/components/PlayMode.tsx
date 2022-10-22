
import * as React from 'react'

import {Box, Button, ButtonGroup, IconButton, Tooltip} from '@mui/material'
import {lightBlue, grey} from '@mui/material/colors'

import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff'
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff'
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'

import {createClasses} from '@axwt/util'


import {Sudoku} from '../data'
import {
    PlayActions,
    selectCurrentPlayBoard, selectPlayState,
    useThunkDispatch,
    useTypedSelector
} from '../store'


import SudokuBoard, {BoardCell, BoardCellProps, SudokuBoardProps} from './SudokuBoard'



const playModeClasses = createClasses('PlayMode', ['overlay'])

const PlayMode: React.FC = () => {

    const board = useTypedSelector(selectCurrentPlayBoard)
    const playState = useTypedSelector(selectPlayState)

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
        let activeCell = board.getCell(x, y)
        let isKnownCell = activeCell.valueType == 'Known' || activeCell.valueType == 'Known-Conflict'

        if('1' <= ev.key && ev.key <= '9' && !isKnownCell) {
            let value = parseInt(ev.key)

            if(playState.entryMode == 'Normal') {
                dispatch(PlayActions.setCellValue(x, y, value))
            } else if(playState.entryMode == 'Candidate') {
                dispatch(PlayActions.toggleCellCandidate(x, y, value))
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
        { playState.gameStage == 'Init' && <>
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
        { playState.gameStage == 'Play' && <>
            <SudokuBoard n={board.n} onClick={handleClick} onBlur={handeBlur} onKeyDown={handleKeyDown} houseHighlight={playState.searchResult?.targetHouse}>
                {board.cells.map(cell => {

                    let highlightedCandidates = playState.searchResult?.candidateHighlights.find(c => c.x == cell.x && c.y == cell.y)?.candidates
                    let clearedCandidates = playState.searchResult?.candidateClearances.find(c => c.x == cell.x && c.y == cell.y)?.toClear

                    let highlight: BoardCellProps['highlight'] = 'none'
                    if(activeCellCoord != null) {
                        let activeCell = board.getCell(activeCellCoord.x, activeCellCoord.y)
                        if(playState.highlight == 'On') {
                            if(board.isSameCell(cell, activeCellCoord)) highlight = 'active'
                            else if(
                                board.isSameColumn(cell, activeCell) ||
                                board.isSameRow(cell, activeCell) ||
                                board.isSameBlock(cell, activeCell)
                            ) highlight = 'indicate'
                            else if(cell.value > 0 && cell.value == activeCell.value)
                                highlight = 'match'
                        } else {
                            if(board.isSameCell(cell, activeCellCoord)) highlight = 'active'
                        }
                    }

                    return <BoardCell
                        key={`cell=${cell.x}-${cell.y}`}
                        n={board.n} x={cell.x} y={cell.y}
                        value={cell.value}
                        valueType={cell.valueType}
                        highlight={highlight}
                        candidates={cell.candidates}
                        highlightedCandidates={highlightedCandidates}
                        clearedCandidates={clearedCandidates}
                    />
                })}
            </SudokuBoard>
            {playState.searchResult != null && <Box textAlign="center">Found: {playState.searchResult.key}</Box>}
        </>}
        { playState.gameStage == 'Done' && <>

        </>}
    </Box>

}

export default PlayMode


export const PlayModeControls: React.FC = () => {

    const playState = useTypedSelector(selectPlayState)
    const dispatch = useThunkDispatch()

    let candidateMode = playState.entryMode == 'Candidate'

    return playState.gameStage == 'Play' && <>
        <ButtonGroup sx={{ marginRight: 4 }}>
            <IconButton>
                <UndoIcon/>
            </IconButton>
            <IconButton>
                <RedoIcon/>
            </IconButton>
        </ButtonGroup>

        <ButtonGroup>
            <Tooltip title="Toggle Candidates Mode">
                <IconButton
                    onClick={() => dispatch(PlayActions.setEntryMode(candidateMode ? 'Normal' : 'Candidate'))}
                    sx={{ color: candidateMode ? lightBlue[500] : 'default' }}
                >
                    {candidateMode ? <EditIcon/> : <EditOffIcon/>}
                </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Highlight">
                <IconButton
                    onClick={() => dispatch(PlayActions.toggleHighlight())}
                    sx={{ color: playState.highlight == 'On' ? lightBlue[500] : 'default' }}
                >
                    {playState.highlight == 'On' ? <FlashlightOnIcon/> : <FlashlightOffIcon/>}
                </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Assistant">
                <IconButton
                    onClick={() => dispatch(PlayActions.toggleAssistant())}
                    sx={{ color: playState.assistant == 'On' ? lightBlue[500] : 'default' }}
                >
                    {playState.assistant == 'On' ? <AutoFixNormalIcon/> : <AutoFixOffIcon/>}
                </IconButton>
            </Tooltip>
        </ButtonGroup>


    </>
}