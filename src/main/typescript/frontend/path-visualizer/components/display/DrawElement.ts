/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {SxProps} from '@mui/material'
import {blueGrey, red} from '@mui/material/colors'
import {Theme} from '@mui/material/styles'

import {createClasses} from '@axwt/util'

import {DisplayOption, Element} from '../../data'


export interface DrawElementProps<E extends Element> {
    element: E
    scale: number
    displayOptions: DisplayOption[]
}

export type DrawElementComponent<E extends Element> = React.FC<DrawElementProps<E>>

export const drawElementClasses = createClasses("DrawElement", [
    "circleElement", "ellipseElement", "lineElement", "pathElement", "polygonElement", "polylineElement", "rectElement",
    "controlPoint", "controlPointHighlighted", "controlPoints", "cpLink", "flagAlt", "line", "lineHighlighted", "raw", "segments", "segment"
])

export const drawElementStyles: SxProps<Theme> = {
    [`& .${drawElementClasses.cpLink}`]: {
        fill: 'none',
        stroke: blueGrey[200],
        strokeWidth: 0.1,
        strokeDasharray: 1
    },
    [`& .${drawElementClasses.flagAlt}`]: {
        fill: 'none',
        stroke: blueGrey[200],
        strokeWidth: 0.1,
        strokeDasharray: 1
    },

    [`& .${drawElementClasses.line}`]: {
        fill: 'none',
        stroke: blueGrey[300],
        strokeWidth: 0.25,

        [`&.${drawElementClasses.lineHighlighted}`]: {
            stroke: red[300]
        },
    },

    [`& .${drawElementClasses.controlPoint}`]: {
        stroke: blueGrey[300],
        strokeWidth: 0.1,
        fill: blueGrey[700],
        r: 0.4,
        zIndex: 100,
        boxShadow: theme => theme.shadows[1],
        cursor: 'pointer',

        [`&.${drawElementClasses.controlPointHighlighted}`]: {
            fill: red[700]
        },
    },
}