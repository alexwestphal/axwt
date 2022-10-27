
import * as React from 'react'

import {Box} from '@mui/material'

import {PanelSizingProps} from '@axwt/core'
import {createClasses} from '@axwt/util'

import {selectBoardMode, useTypedSelector} from '../store'

import BoardTitleBar from './BoardTitleBar'
import DefineMode from './DefineMode'
import PlayMode from './PlayMode'
import {sudokuBoardClasses} from './SudokuBoard'
import SolveMode from './SolveMode'



export const mainPanelClasses = createClasses("MainPanel", ["container", "controls", "display", "controlsSpacer"])

export const MainPanel: React.FC<PanelSizingProps> = (props) => {

    const boardMode = useTypedSelector(selectBoardMode)

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


            [`& .${sudokuBoardClasses.root}`]: {
                width: size,
                height: size,
            },
        }}
    >
        <BoardTitleBar/>
        <div className={classes.container}>
            { boardMode == 'Define' && <DefineMode/>}
            { boardMode == 'Play' && <PlayMode/>}
            { boardMode == 'Solve' && <SolveMode/>}
        </div>
    </Box>
}

export default MainPanel