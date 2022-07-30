/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box, Tooltip} from '@mui/material'

import {cls} from '@axwt/util'

import {Element} from '../../data'


import {DrawElementComponent, drawElementClasses} from './DrawElement'


export const DrawEllipse: DrawElementComponent<Element.Ellipse> = ({element, displayOptions, scale}) => {

    const {cx, cy, rx, ry} = element

    const classes = drawElementClasses
    return <Box
        component="g"
        className={cls(classes.root, classes.ellipseElement)}
    >
        {displayOptions.includes('Raw') && <g className={classes.raw} transform={`scale(${scale})`}>
            <ellipse
                cx={cx} cy={cy} rx={rx} ry={ry}
                pathLength={element.pathLength}
                {...element.presentation}
            />
        </g>}
        { displayOptions.includes("Detail") && <>
            <g className={classes.segments}>
                <ellipse
                    className={classes.line}
                    cx={cx * scale}
                    cy={cy * scale}
                    rx={rx * scale}
                    ry={ry * scale}
                />
                <Tooltip title={`rx = ${rx}`}>
                    <path className={classes.cpLink} d={`M ${element.cx * scale} ${element.cy * scale} h ${rx * scale}`}/>
                </Tooltip>
                <Tooltip title={`ry = ${ry}`}>
                    <path className={classes.cpLink} d={`M ${element.cx * scale} ${element.cy * scale} v ${ry * scale}`}/>
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

export default DrawEllipse