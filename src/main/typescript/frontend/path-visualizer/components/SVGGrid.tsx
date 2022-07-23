/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box} from '@mui/material'
import {blueGrey} from '@mui/material/colors'


import {ArrayUtils, cls, createClasses} from '@axwt/util'

import {ViewBox} from '../data'
import {selectGridLines, useTypedSelector} from '../store'



export interface SVGGridProps {
    viewBox: ViewBox
    showGridLines: boolean
}

export const svgGridClasses = createClasses("SVGGrid", ["border", "gridLineLabel", "gridLineMajor", "gridLineMajor_label", "gridLineMinor", "gridLineMinor_label"])

export const SVGGrid: React.FC<SVGGridProps> = ({viewBox, showGridLines}) => {

    const gridLines = useTypedSelector(selectGridLines)

    const classes = svgGridClasses

    const scaleRatio = 100 / viewBox.width

    return <Box className={classes.root} component="g" sx={{
        [`& .${classes.border}`]: {
            fill: 'none',
            stroke: blueGrey[100],
            strokeOpacity: 0.5,
            strokeWidth: 0.25,
        },
        [`& .${classes.gridLineLabel}`]: {
            fontSize: 1.5,
            fill: blueGrey[500],
            userSelect: 'none',
        },
        [`& .${classes.gridLineMajor}`]: {
            '& line': {
                stroke: blueGrey[200],
                strokeOpacity: 0.4,
                strokeWidth: 0.25,
            },
        },
        [`& .${classes.gridLineMinor}`]: {
            '& line': {
                stroke: blueGrey[100],
                strokeOpacity: 0.4,
                strokeWidth: 0.2,
            },

            [`& .${classes.gridLineLabel}`]: {
                //visibility: 'hidden',
                fill: blueGrey[100],
            },

            '&:hover': {

                [`& .${classes.gridLineLabel}`]: {
                    visibility: 'visible',
                },
            },
        },
    }}>
        <path className={classes.border} d="M 0 0 H 100 V 100 H 0 Z"/>
        {ArrayUtils.range(viewBox.minX, viewBox.minX+viewBox.width+1, 1).map(x => {
            let isMajor = x % gridLines.majorInterval == 0
            let isMinor = x % gridLines.minorInterval == 0

            return (isMajor || isMinor) && <g
                key={x}
                className={cls({ [classes.gridLineMajor]: isMajor, [classes.gridLineMinor]: !isMajor && isMinor })}
            >
                { showGridLines &&  <line x1={x * scaleRatio} y1={0} x2={x * scaleRatio} y2={100}/>}
                <text className={classes.gridLineLabel} x={x * scaleRatio} y={-1} textAnchor="middle">{x}</text>
                <text className={classes.gridLineLabel} x={x * scaleRatio} y={102} textAnchor="middle">{x}</text>
            </g>
        })}
        {ArrayUtils.range(viewBox.minY, viewBox.height+1, 1).map(y => {
            let isMajor = y % gridLines.majorInterval == 0
            let isMinor = y % gridLines.minorInterval == 0

            return (isMajor || isMinor) && <g
                key={y}
                className={cls({ [classes.gridLineMajor]: isMajor, [classes.gridLineMinor]: !isMajor && isMinor })}
            >
                { showGridLines && <line x1={0} y1={y * scaleRatio} x2={100} y2={y * scaleRatio}/> }
                <text className={classes.gridLineLabel} x={-0.75} y={y * scaleRatio + 0.5} textAnchor="end">{y}</text>
                <text className={classes.gridLineLabel} x={100.75} y={y * scaleRatio + 0.5} textAnchor="start">{y}</text>
            </g>
        })}
    </Box>
}

export default SVGGrid