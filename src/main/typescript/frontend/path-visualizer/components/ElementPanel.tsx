/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Button, TextField} from '@mui/material'

import {createClasses} from '@axwt/util'
import {selectCurrentElement, useThunkDispatch, useTypedSelector} from '../store'


export const elementPanelClasses = createClasses("ElementPanel", [])

export const ElementPanel: React.FC = () => {

    const element = useTypedSelector(selectCurrentElement)

    const dispatch = useThunkDispatch()

    const classes = elementPanelClasses

    return <Box
        className={classes.root}
        sx={{

        }}
    >
        Element
    </Box>
}

export default ElementPanel