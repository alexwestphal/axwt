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


export const CircleSpecificAttributes: ElementAttributesComponent<Element.Circle> = ({element}) => {

    const dispatch = useThunkDispatch()

    const handleChange = (attrName: keyof Element.Circle) => (newValue: number) => {
        dispatch(ElementsActions.setMainAttribute<Element.Circle>(element.elementId, attrName, newValue))
    }

    const classes = elementAttributesClasses
    return <Box className={cls(classes.root, classes.circle)}>
        <Typography variant="h6" className={classes.title}>Circle Specific Attributes</Typography>
        <Grid container>
            <Grid item xs={3}>
                <NumberField
                    label="cx"
                    value={element.cx}
                    onChange={handleChange("cx")}/>
            </Grid>
            <Grid item xs={3}>
                <NumberField
                    label="cy"
                    value={element.cy}
                    onChange={handleChange("cy")}/>
            </Grid>
            <Grid item xs={3}>
                <NumberField
                    label="r"
                    value={element.r}
                    onChange={handleChange("r")}/>
            </Grid>
            <Grid item xs={3}>
                <NumberField
                    label="pathLength"
                    value={element.pathLength}
                    onChange={handleChange("pathLength")}/>
            </Grid>
        </Grid>
    </Box>
}

export default CircleSpecificAttributes