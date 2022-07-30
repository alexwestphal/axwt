/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box, Tooltip} from '@mui/material'

import {cls} from '@axwt/util'

import {Element} from '../../data'


import {DrawElementComponent, drawElementClasses} from './DrawElement'


export const DrawLine: DrawElementComponent<Element.Line> = ({element, displayOptions, scale}) => {

    const {x1, y1, x2, y2} = element

    const classes = drawElementClasses
    return <Box
        component="g"
        className={cls(classes.root, classes.circleElement)}
    >
        {displayOptions.includes('Raw') && <g className={classes.raw} transform={`scale(${scale})`}>
            <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                pathLength={element.pathLength}
                {...element.presentation}
            />
        </g>}
        { displayOptions.includes("Detail") && <>
            <g className={classes.segments}>
                <line
                    className={classes.line}
                    x1={x1 * scale}
                    y1={y1 * scale}
                    x2={x2 * scale}
                    y2={y2 * scale}
                />
            </g>
            <g className={classes.controlPoints}>
                <Tooltip title={`${x1}, ${y1}`}>
                    <circle
                        className={cls(classes.controlPoint)}
                        cx={x1 * scale} cy={y1 * scale}
                    />
                </Tooltip>
                <Tooltip title={`${x2}, ${y2}`}>
                    <circle
                        className={cls(classes.controlPoint)}
                        cx={x2 * scale} cy={y2 * scale}
                    />
                </Tooltip>
            </g>
        </>}
    </Box>
}

export default DrawLine