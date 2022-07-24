/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Button, TextField} from '@mui/material'

import {createClasses} from '@axwt/util'
import {selectCurrentElement, useThunkDispatch, useTypedSelector} from '../store'


import HtmlIdField from './HtmlIdField'


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
        <HtmlIdField element={element}/>


    </Box>
}

export default ElementPanel