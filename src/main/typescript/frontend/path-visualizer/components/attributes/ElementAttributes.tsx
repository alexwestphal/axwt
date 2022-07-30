/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {inputClasses, inputLabelClasses, SxProps} from '@mui/material'

import {createClasses} from '@axwt/util'

import {Element} from '../../data'


export interface ElementAttributesProps<E extends Element> {
    element: E
}

export type ElementAttributesComponent<E extends Element> = React.FC<ElementAttributesProps<E>>


export const elementAttributesClasses = createClasses("ElementFields", [
    "circle", "ellipse", "g", "line", "path", "polygon", "polyline", "rect",
    "segmentList", "title"
])

export const elementAttributesStyles: SxProps = {

    [`& .${inputClasses.input}`]: {
        paddingTop: 1/2,
        paddingX: 1,
    },
    [`& .${inputLabelClasses.root}`]: {
        paddingTop: 1/2,
        paddingX: 1
    },

    [`& .${elementAttributesClasses.path}`]: {
        flexGrow: 1,
    },

    [`& .${elementAttributesClasses.segmentList}`]: {
        flex: '1 0 0',
        marginBottom: 1,
    },

    [`& .${elementAttributesClasses.title}`]: {
        marginY: 1,
        paddingX: 1,
    },
}