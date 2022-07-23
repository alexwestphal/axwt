/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {blueGrey} from '@mui/material/colors'

export interface ViewBox {
    minX: number
    minY: number
    width: number
    height: number
}


export interface GridLineConfig {
    majorColor: string
    majorInterval: number // ratio to the viewBoxWidth
    majorWidth: number

    minorColor: string
    minorInterval: number // ratio to the viewBoxWidth
    minorWidth: number
}

export namespace GridLineConfig {
    export const Default: GridLineConfig = {
        majorColor: blueGrey[200],
        majorInterval: 10,
        majorWidth: 1/400,

        minorColor: blueGrey[100],
        minorInterval: 1,
        minorWidth: 1/500,
    }
}