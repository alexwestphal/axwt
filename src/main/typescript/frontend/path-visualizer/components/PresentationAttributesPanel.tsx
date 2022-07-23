/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Button, TextField} from '@mui/material'

import {createClasses} from '@axwt/util'
import {selectCurrentElement, useThunkDispatch, useTypedSelector} from '../store'


export const presentationAttributesPanelClasses = createClasses("PresentationAttributesPanel", [])

export const PresentationAttributesPanel: React.FC = () => {

    const element = useTypedSelector(selectCurrentElement)

    const dispatch = useThunkDispatch()

    const classes = presentationAttributesPanelClasses

    return <Box
        className={classes.root}
        sx={{

        }}
    >
        Edit Presentation Attributes
    </Box>
}

export default PresentationAttributesPanel