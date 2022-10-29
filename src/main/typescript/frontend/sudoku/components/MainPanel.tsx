
import * as React from 'react'

import {Box, Button} from '@mui/material'

import {PanelSizingProps} from '@axwt/core'
import {cls, createClasses} from '@axwt/util'

import {AppActions, selectAppState, useThunkDispatch, useTypedSelector} from '../store'

import BoardTitleBar from './BoardTitleBar'
import DefineMode from './DefineMode'
import NewBoardDialog from './NewBoardDialog'
import PlayMode from './PlayMode'
import {SudokuBoard, sudokuBoardClasses} from './SudokuBoard'
import SolveMode from './SolveMode'


export const mainPanelClasses = createClasses("MainPanel", ["container", "controls", "controlsSpacer", "display", "noCurrentBoard", "overlay"])

export const MainPanel: React.FC<PanelSizingProps> = (props) => {

    const appState = useTypedSelector(selectAppState)
    const dispatch = useThunkDispatch()

    const size = Math.min(props.width, props.height - 80) * 0.75

    const classes = mainPanelClasses
    return <Box
        className={cls(classes.root, { [classes.noCurrentBoard]: !appState.active })}
        sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            [`&.${classes.noCurrentBoard}`]: {
                justifyContent: 'center',
            },

            [`& .${classes.container}`]: {
                flex: '1 0 0',
                width: size,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            },
            [`& .${classes.controls}`]: {
                display: 'flex',
                height: '40px',
                marginY: 1
            },
            [`& .${classes.controlsSpacer}`]: {
                flex: '1 0 0'
            },
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


            [`& .${sudokuBoardClasses.root}`]: {
                width: size,
                height: size,
            },
        }}
    >
        { appState.active
            ? <>
                <BoardTitleBar/>
                <div className={classes.container}>
                    { appState.appMode == 'Define' && <DefineMode/>}
                    { appState.appMode == 'Play' && <PlayMode/>}
                    { appState.appMode == 'Solve' && <SolveMode/>}
                </div>
            </>
            : <>
                <div>
                    <SudokuBoard n={3}/>
                </div>
                <div className={classes.overlay}>
                    <Button
                        variant="contained"
                        onClick={() => dispatch(AppActions.setNewBoardDialogOpen(true))}
                    >New Board</Button>
                </div>
            </>
        }
        <NewBoardDialog
            open={appState.newBoardDialogOpen}
            onClose={() => dispatch(AppActions.setNewBoardDialogOpen(false))}
        />
    </Box>
}

export default MainPanel
