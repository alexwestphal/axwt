
import * as React from 'react'

import {Box, Divider, IconButton, ToggleButton, ToggleButtonGroup, Tooltip} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ConstructionIcon from '@mui/icons-material/Construction'
import EditIcon from '@mui/icons-material/Edit'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'


import {BoardActions, selectBoardMode, useThunkDispatch, useTypedSelector} from '../store'
import {createClasses} from '@axwt/util'
import {AppMode} from '@axwt/sudoku/data'

const boardTitleBarClasses = createClasses("BoardTitleBar", ['button', 'menu', 'modeSelector', 'spacer', 'title'])

export const BoardTitleBar: React.FC = () => {

    const currentMode = useTypedSelector(selectBoardMode)
    const dispatch = useThunkDispatch()

    const handleChangeMode = (mode: AppMode) => () => dispatch(BoardActions.setMode(mode))

    const classes = boardTitleBarClasses
    return <Box
        className={classes.root}
        sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%', height: '36px',
            borderBottom: 1,
            borderBottomColor: 'divider',

            [`& .${classes.button}`]: {

            },
            [`& .${classes.menu}`]: {
                width: '150px',
            },
            [`& .${classes.modeSelector}`]: {
                "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                }
            },
            [`& .${classes.spacer}`]: {
                flex: '1 0 0',
            },
            [`& .${classes.title}`]: {

                fontWeight: 'bold',
                paddingX: 1,
                marginX: 1,
                paddingTop: .5,
            },
        }}
    >
        <div className={classes.title} tabIndex={0}>My Sudoku Board</div>
        <div className={classes.spacer}></div>

        <ToggleButtonGroup
            className={classes.modeSelector}
            size="small"
        >
            <Tooltip title="Define Mode">
                <ToggleButton
                    value="Define" size="small"
                    selected={currentMode == 'Define'}
                    onChange={handleChangeMode('Define')}
                >
                    <EditIcon fontSize="small"/>
                </ToggleButton>
            </Tooltip>
            <Tooltip title="Game Mode">
                <ToggleButton
                    value="Play" size="small"
                    selected={currentMode == 'Play'}
                    onChange={handleChangeMode('Play')}
                >
                    <SportsEsportsIcon fontSize="small"/>
                </ToggleButton>
            </Tooltip>
            <Tooltip title="Solve Mode">
                <ToggleButton
                    value="Solve" size="small"
                    selected={currentMode == 'Solve'}
                    onChange={handleChangeMode('Solve')}
                >
                    <ConstructionIcon fontSize="small"/>
                </ToggleButton>
            </Tooltip>
        </ToggleButtonGroup>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }}/>
        <Tooltip title="Close Board">
            <IconButton size="small">
                <CloseIcon fontSize="small"/>
            </IconButton>
        </Tooltip>
    </Box>
}

export default BoardTitleBar