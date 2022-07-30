/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, TextField, Typography} from '@mui/material'

import {createClasses} from '@axwt/util'

import {Element} from '../../data'
import {ElementsActions, selectCurrentElement, useThunkDispatch, useTypedSelector} from '../../store'

import CircleSpecificAttributes from './CircleSpecificAttributes'
import EllipseSpecificAttributes from './EllipseSpecificAttributes'
import {elementAttributesClasses, elementAttributesStyles} from './ElementAttributes'
import HtmlIdField from './HtmlIdField'
import LineSpecificAttributes from './LineSpecificAttributes'
import PanelNotAvailable from '../PanelNotAvailable'
import PathSpecificAttributes from './PathSpecificAttributes'



export const elementPanelClasses = createClasses("ElementPanel", [])

export const ElementPanel: React.FC = () => {

    const element = useTypedSelector(selectCurrentElement)

    const dispatch = useThunkDispatch()

    if(element == null) return <PanelNotAvailable reason="No element selected."/>

    const handleChangeClassName = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        dispatch(ElementsActions.setClassName(element.elementId, value))
    }

    const classes = elementPanelClasses

    return <Box className={classes.root} sx={elementAttributesStyles}>
        <Box pb={2}>
            <Typography variant="h6" className={elementAttributesClasses.title}>Core Attributes</Typography>
            <HtmlIdField element={element}/>
            <TextField
                variant="standard"
                fullWidth
                label="class"
                value={element.className}
                onChange={handleChangeClassName}
            />
        </Box>

        { Element.isCircle(element) && <CircleSpecificAttributes element={element}/> }
        { Element.isEllipse(element) && <EllipseSpecificAttributes element={element}/> }
        { Element.isLine(element) && <LineSpecificAttributes element={element}/> }
        { Element.isPath(element) && <PathSpecificAttributes element={element}/> }
    </Box>
}

export default ElementPanel
