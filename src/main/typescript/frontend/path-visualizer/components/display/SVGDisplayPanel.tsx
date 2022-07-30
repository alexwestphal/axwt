/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {
    Box, ButtonGroup,
    IconButton,
    ToggleButton, ToggleButtonGroup, Tooltip
} from '@mui/material'

import GridIcon from '@mui/icons-material/Grid4x4'
import PolylineIcon from '@mui/icons-material/Polyline'
import RawIcon from '@mui/icons-material/RawOn'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'

import {PanelSizingProps} from '@axwt/core/components/ResizeablePanelLayout'
import {createClasses} from '@axwt/util'

import {DisplayOption, Element} from '../../data'
import {selectCurrentElement, selectViewBox, useTypedSelector} from '../../store'

import DrawCircle from './DrawCircle'
import {drawElementStyles} from './DrawElement'
import DrawEllipse from './DrawEllipse'
import DrawLine from './DrawLine'
import DrawPath from './DrawPath'
import SVGGrid from './SVGGrid'



export const svgDisplayPanelClasses = createClasses("SVGDisplayPanel", ["container", "controls", "display", "axisLabel"])

export const SVGDisplayPanel: React.FC<PanelSizingProps> = (props) => {

    const viewBox = useTypedSelector(selectViewBox)
    const currentElement = useTypedSelector(selectCurrentElement)

    const [displayOptions, setDisplayOptions] = React.useState<DisplayOption[]>(['Grid', 'Detail'])

    const handleOption = (event: React.MouseEvent<HTMLElement>, newOptions: string[]) => {
        setDisplayOptions(newOptions as DisplayOption[])
    }

    const size = Math.min(props.width, props.height - 40)
    const scaleRatio = 100 /viewBox.width

    const classes = svgDisplayPanelClasses

    return <Box
        className={classes.root}
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',

            [`& .${classes.container}`]: {
                flex: '1 0 0',
                width: size,
            },
            [`& .${classes.controls}`]: {
                display: 'flex',
                justifyContent: 'space-between',
                marginY: 1,
                paddingX: 2
            },

            [`& .${classes.display}`]: {
                width: size,
                height: size,
            },

            ...drawElementStyles
        }}
    >
        <div className={classes.controls}>
            <div>

            </div>
            <div>

                <ToggleButtonGroup
                    size="small"
                    value={displayOptions}
                    onChange={handleOption}
                >
                    <ToggleButton value="Grid">
                        <Tooltip title="Toggle Grid">
                            <GridIcon/>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="Raw">
                        <Tooltip title="Toggle Raw Path">
                            <RawIcon/>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="Detail">
                        <Tooltip title="Toggle Segment Detail">
                            <PolylineIcon/>
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div>
                <ButtonGroup>
                    <IconButton>
                        <ZoomOutIcon/>
                    </IconButton>
                    <IconButton>
                        <ZoomInIcon/>
                    </IconButton>
                </ButtonGroup>
            </div>
        </div>
        <div className={classes.container}>
            <svg className={classes.display} viewBox={`-5 -5 110 110`}>
                <SVGGrid viewBox={viewBox} showGridLines={displayOptions.includes('Grid')}/>

                { Element.isCircle(currentElement) && <DrawCircle element={currentElement} displayOptions={displayOptions} scale={scaleRatio}/>}
                { Element.isEllipse(currentElement) && <DrawEllipse element={currentElement} displayOptions={displayOptions} scale={scaleRatio}/>}
                { Element.isLine(currentElement) && <DrawLine element={currentElement} displayOptions={displayOptions} scale={scaleRatio}/>}
                { Element.isPath(currentElement) && <DrawPath element={currentElement} displayOptions={displayOptions} scale={scaleRatio}/> }
            </svg>
        </div>
    </Box>
}

export default SVGDisplayPanel



