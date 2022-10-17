
import * as React from 'react'

import {Box, Button, Grid, Typography} from '@mui/material'

import {createClasses} from '@axwt/util'

import {PlayActions, useThunkDispatch} from '../store'


export const assistantPanelClasses = createClasses('AssistantPanel', ["title", "commandSet", "commandSet_label", "commandSet_spacer"])

export const AssistantPanel: React.FC = () => {

    const dispatch = useThunkDispatch()

    const classes = assistantPanelClasses
    return <Box
        className={classes.root}
        sx={{
            padding: 1,

            [`& .${classes.title}`]: {
                textAlign: 'center',
                marginY: 2
            },
            [`& .${classes.commandSet}`]: {
                display: 'flex',
                alignItems: 'center',

                [`& .${classes.commandSet_label}`]: {
                    flex: '1 0 0',
                    fontWeight: 'bold'
                },

                [`& .${classes.commandSet_spacer}`]: {
                    flex: '1 0 0',
                },

                "& button": {
                    marginLeft: 1,
                }
            },

        }}
    >
        <Typography className={classes.title} variant="h4">Sudoku Assistant</Typography>
        <div className={classes.commandSet}>
            <div className={classes.commandSet_label}>Notes:</div>
            <Button variant="outlined" onClick={() => dispatch(PlayActions.generateNotes())}>Generate</Button>
            <Button variant="outlined" onClick={() => dispatch(PlayActions.clearNotes())}>Clear</Button>
            <div className={classes.commandSet_spacer}></div>
        </div>

    </Box>
}

export default AssistantPanel