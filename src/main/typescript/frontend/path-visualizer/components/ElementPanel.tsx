/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Button, Grid, inputClasses, inputLabelClasses, MenuItem, TextField} from '@mui/material'

import {createClasses} from '@axwt/util'

import {ElementsActions, selectCurrentElement, useThunkDispatch, useTypedSelector} from '../store'

import HtmlIdField from './HtmlIdField'



export const elementPanelClasses = createClasses("ElementPanel", [])

export const ElementPanel: React.FC = () => {

    const element = useTypedSelector(selectCurrentElement)

    const dispatch = useThunkDispatch()

    const classes = elementPanelClasses

    return <Box
        className={classes.root}
        sx={{

            [`& .${inputClasses.input}`]: {
                paddingTop: 1/2,
                paddingX: 1
            },
            [`& .${inputLabelClasses.root}`]: {
                paddingTop: 1/2,
                paddingX: 1
            },
        }}
    >
        <HtmlIdField element={element}/>
    </Box>
}

export default ElementPanel
