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


export const EllipseSpecificAttributes: ElementAttributesComponent<Element.Ellipse> = ({element}) => {

    const dispatch = useThunkDispatch()

    const handleChange = (attrName: keyof Element.Ellipse) => (newValue: number) => {
        dispatch(ElementsActions.setMainAttribute<Element.Ellipse>(element.elementId, attrName, newValue))
    }

    const classes = elementAttributesClasses
    return <Box className={cls(classes.root, classes.ellipse)}>
        <Typography variant="h6" className={classes.title}>Ellipse Specific Attributes</Typography>
        <Grid container>
            <Grid item xs={2}>
                <NumberField
                    label="cx"
                    value={element.cx}
                    onChange={handleChange("cx")}/>
            </Grid>
            <Grid item xs={2}>
                <NumberField
                    label="cy"
                    value={element.cy}
                    onChange={handleChange("cy")}/>
            </Grid>
            <Grid item xs={2}>
                <NumberField
                    label="ry"
                    value={element.rx}
                    onChange={handleChange("rx")}/>
            </Grid>
            <Grid item xs={2}>
                <NumberField
                    label="ry"
                    value={element.ry}
                    onChange={handleChange("ry")}/>
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

export default EllipseSpecificAttributes