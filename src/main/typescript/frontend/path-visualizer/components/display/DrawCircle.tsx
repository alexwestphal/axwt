/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box, Tooltip} from '@mui/material'

import {cls} from '@axwt/util'

import {Element} from '../../data'


import {DrawElementComponent, drawElementClasses} from './DrawElement'


export const DrawCircle: DrawElementComponent<Element.Circle> = ({element, displayOptions, scale}) => {

    const {cx, cy, r} = element

    const classes = drawElementClasses
    return <Box
        component="g"
        className={cls(classes.root, classes.circleElement)}
    >
        {displayOptions.includes('Raw') && <g className={classes.raw} transform={`scale(${scale})`}>
            <circle
                cx={cx} cy={cy} r={r}
                pathLength={element.pathLength}
                {...element.presentation}
            />
        </g>}
        { displayOptions.includes("Detail") && <>
            <g className={classes.segments}>
                <circle
                    className={classes.line}
                    cx={cx * scale}
                    cy={cy * scale}
                    r={r * scale}
                />
                <Tooltip title={`r = ${r}`}>
                    <path className={classes.cpLink} d={`M ${element.cx * scale} ${element.cy * scale} h ${r * scale}`}/>
                </Tooltip>
            </g>
            <g className={classes.controlPoints}>
                <Tooltip title={`${cx}, ${cy}`}>
                    <circle
                        className={cls(classes.controlPoint)}
                        cx={cx * scale} cy={cy * scale}
                    />
                </Tooltip>
            </g>
        </>}
    </Box>
}

export default DrawCircle