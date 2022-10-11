
import * as React from 'react'

import {Box, Button, ButtonGroup, IconButton, MenuItem, TextField} from '@mui/material'
import RedoIcon from '@mui/icons-material/Redo'
import SaveIcon from '@mui/icons-material/Save'
import UndoIcon from '@mui/icons-material/Undo'

import {PanelSizingProps} from '@axwt/core'
import {createClasses} from '@axwt/util'

import {AppMode} from '../data'
import {AppActions, selectAppMode, useThunkDispatch, useTypedSelector} from '../store'

import EditMode from './EditMode'
import PlayMode from './PlayMode'
import {sudokuBoardClasses} from './SudokuBoard'
import SolveMode from './SolveMode'


export const mainPanelClasses = createClasses("MainPanel", ["container", "controls", "display", "appModeSelect", "saveButton", "controlsSpacer"])

export const MainPanel: React.FC<PanelSizingProps> = (props) => {

    const appMode = useTypedSelector(selectAppMode)
    const dispatch = useThunkDispatch()

    const size = Math.min(props.width, props.height - 80) * 0.75

    const classes = mainPanelClasses
    return <Box
        className={classes.root}
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            [`& .${classes.container}`]: {
                flex: '1 0 0',
                width: size,
            },
            [`& .${classes.controls}`]: {
                display: 'flex',
                marginTop: 2,
                marginBottom: 1,
                //paddingX: 1,
            },
            [`& .${classes.controlsSpacer}`]: {
                flex: '1 0 0'
            },
            [`& .${classes.appModeSelect}`]: {
                width: '8em',
                marginRight: 2
            },
            [`& .${classes.saveButton}`]: {
                marginLeft: 2,
            },

            [`& .${sudokuBoardClasses.root}`]: {
                width: size,
                height: size,
            },
        }}
    >
        <div className={classes.container}>
            <div className={classes.controls}>
                <TextField
                    className={classes.appModeSelect}
                    label="Mode"
                    size="small"
                    select
                    value={appMode}
                    onChange={(ev) => dispatch(AppActions.setMode(ev.target.value as AppMode))}
                >
                    <MenuItem value="Define">Define</MenuItem>
                    <MenuItem value="Play">Play</MenuItem>
                    <MenuItem value="Solve">Solve</MenuItem>
                </TextField>
                <div className={classes.controlsSpacer}></div>
                <ButtonGroup>
                    <IconButton>
                        <UndoIcon/>
                    </IconButton>
                    <IconButton>
                        <RedoIcon/>
                    </IconButton>
                </ButtonGroup>
                <Button
                    className={classes.saveButton}
                    variant="contained"
                    endIcon={<SaveIcon/>}
                    onClick={() => dispatch(AppActions.quickSave())}
                >Save</Button>
            </div>
            { appMode == 'Define' && <EditMode/>}
            { appMode == 'Play' && <PlayMode/>}
            { appMode == 'Solve' && <SolveMode/>}
        </div>
    </Box>
}

export default MainPanel