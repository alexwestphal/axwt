/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box, Grid, Typography} from '@mui/material'

import {cls} from '@axwt/util'

import {Element} from '../../data'
import {ElementsActions, useThunkDispatch} from '../../store'

import {elementAttributesClasses, ElementAttributesComponent} from './ElementAttributes'
import NumberField from './NumberField'


export const LineSpecificAttributes: ElementAttributesComponent<Element.Line> = ({element}) => {

    const dispatch = useThunkDispatch()

    const handleChange = (attrName: keyof Element.Line) => (newValue: number) => {
        dispatch(ElementsActions.setMainAttribute<Element.Line>(element.elementId, attrName, newValue))
    }

    const classes = elementAttributesClasses
    return <Box className={cls(classes.root, classes.line)}>
        <Typography variant="h6" className={classes.title}>Line Specific Attributes</Typography>
        <Grid container>
            <Grid item xs={2}>
                <NumberField
                    label="x1"
                    value={element.x1}
                    onChange={handleChange("x1")}/>
            </Grid>
            <Grid item xs={2}>
                <NumberField
                    label="y1"
                    value={element.y1}
                    onChange={handleChange("y1")}/>
            </Grid>
            <Grid item xs={2}>
                <NumberField
                    label="x2"
                    value={element.x2}
                    onChange={handleChange("x2")}/>
            </Grid>
            <Grid item xs={2}>
                <NumberField
                    label="y2"
                    value={element.y2}
                    onChange={handleChange("y2")}/>
            </Grid>
            <Grid item xs={4}>
                <NumberField
                    label="pathLength"
                    value={element.pathLength}
                    onChange={handleChange("pathLength")}/>
            </Grid>
        </Grid>
    </Box>
}

export default LineSpecificAttributes