/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {
    Box, ButtonGroup,
    IconButton,
    ToggleButton, ToggleButtonGroup, Tooltip
} from '@mui/material'
import {blueGrey, red} from '@mui/material/colors'

import GridIcon from '@mui/icons-material/Grid4x4'
import PolylineIcon from '@mui/icons-material/Polyline'
import RawIcon from '@mui/icons-material/RawOn'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'

import {PanelSizingProps} from '@axwt/core/components/ResizeablePanelLayout'
import {cls, createClasses} from '@axwt/util'

import {Element, PathSegment, PathSegmentHighlight} from '../data'
import {
    PathSegmentsActions,
    selectCurrentElement,
    selectHighlightedSegment,
    selectSegmentsByPath,
    selectViewBox, useThunkDispatch,
    useTypedSelector
} from '../store'


import SVGGrid from './SVGGrid'



type DisplayOption = 'Grid' | 'Raw' | 'Detail'

export const svgDisplayPanelClasses = createClasses("SVGDisplayPanel", ["container", "controls", "display", "axisLabel"])

export const SVGDisplayPanel: React.FC<PanelSizingProps> = (props) => {

    const viewBox = useTypedSelector(selectViewBox)
    const element = useTypedSelector(selectCurrentElement)

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
            }
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
                { element?.elementType == 'path' && <DrawPath path={element as Element.Path} displayOptions={displayOptions} scale={scaleRatio}/> }
            </svg>
        </div>
    </Box>
}

export default SVGDisplayPanel



interface DrawPathProps {
    path: Element.Path
    scale: number
    displayOptions: DisplayOption[]
}

const drawPathClasses = createClasses("DrawPath", ["controlPoint", "controlPointHighlighted", "controlPoints", "cpLink", "flagAlt", "line", "lineHighlighted", "raw", "segments", "segment"])

const DrawPath: React.FC<DrawPathProps> = ({path, displayOptions, scale}) => {

    const segments = useTypedSelector(state => selectSegmentsByPath(state, path.elementId))
    const highlight = useTypedSelector(selectHighlightedSegment)

    const dispatch = useThunkDispatch()

    const handleHighlight = (highlight: PathSegmentHighlight) => {
        dispatch(PathSegmentsActions.selectHighlight(highlight))
    }

    const classes = drawPathClasses


    const lines: React.ReactNode[] = [], controlPoints: React.ReactNode[] = []

    if(displayOptions.includes('Detail')) {
        PathSegment.withDerivedValues(segments).forEach((segment, segmentIndex) => {
            let highlighted = segment.segmentId == highlight?.segmentId
            let segmentString = PathSegment.toString(segment)

            let { x0,y0, x,y, x1,y1, x2,y2, startPointReflects } = segment.derived

            const buildPath = (d: string): React.ReactNode => <Tooltip title={segmentString}>
                <path
                    key={`Segment-${segmentIndex}-Line`}
                    className={cls(classes.line, { [classes.lineHighlighted]: highlighted })}
                    d={d}
                />
            </Tooltip>

            switch(segment.command) {
                case 'A':
                case 'a': {
                    let {rx, ry, angle, largeArc, sweep} = segment.arguments
                    lines.push(buildPath(
                        `M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc} ${sweep} ${x * scale} ${y * scale}`
                    ))
                    if(highlight?.largeArc) lines.push(
                        <path
                            key={`Segment-${segmentIndex}-LargeArcAlt`}
                            className={classes.flagAlt}
                            d={`M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc ? 0 : 1} ${sweep} ${x * scale} ${y * scale}`}
                        />
                    )
                    if(highlight?.sweep) lines.push(
                        <path
                            key={`Segment-${segmentIndex}-SweepAlt`}
                            className={classes.flagAlt}
                            d={`M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc} ${sweep ? 0 : 1} ${x * scale} ${y * scale}`}
                        />
                    )
                    break
                }
                case 'C':
                case 'c':
                case 'S':
                case 's':
                    lines.push(
                        buildPath(
                            `M ${x0 * scale} ${y0 * scale} C ${x1 * scale} ${y1 * scale} ${x2 * scale} ${y2 * scale} ${x * scale} ${y * scale}`
                        ),
                        <path
                            key={`Segment-${segmentIndex}-CPLink1`}
                            className={classes.cpLink}
                            d={`M ${x0 * scale} ${y0 * scale} L ${x1 * scale} ${y1 * scale}`}
                        />,
                        <path
                            key={`Segment-${segmentIndex}-CPLink2`}
                            className={classes.cpLink}
                            d={`M ${x2 * scale} ${y2 * scale} L ${x * scale} ${y * scale}`}
                        />,
                    )
                    break

                case 'H':
                case 'h':
                case 'L':
                case 'l':
                case 'V':
                case 'v':
                    lines.push(buildPath(
                        `M ${x0 * scale} ${y0 * scale} L ${x * scale} ${y * scale}`
                    ))
                    break

                case 'M':
                case 'm':
                    // Only Need the control point
                    break

                case 'Q':
                case 'q':
                case 'T':
                case 't':
                    lines.push(
                        buildPath(
                            `M ${x0 * scale} ${y0 * scale} Q ${x1 * scale} ${y1 * scale} ${x * scale} ${y * scale}`
                        ),
                        <path
                            key={`Segment-${segmentIndex}-CPLink`}
                            className={classes.cpLink} d={`M ${x0 * scale} ${y0 * scale} L ${x1 * scale} ${y1 * scale} L ${x * scale} ${y * scale}`}
                        />,
                    )
                    break

            }

            let reflectedPointHighlighted = !highlighted && startPointReflects && startPointReflects.segmentId == highlight.segmentId && startPointReflects.pointType == highlight.pointType
            if(x1) controlPoints.push(<Tooltip title={`${x1}, ${y1}`}>
                <circle
                    key={`Segment-${segmentIndex}-StartCP`}
                    className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'StartControl' || reflectedPointHighlighted })}
                    cx={x1 * scale} cy={y1 * scale}
                    onClick={() => handleHighlight(startPointReflects
                        ? {segmentId: startPointReflects.segmentId, pointType: startPointReflects.pointType}
                        : { segmentId: segment.segmentId, pointType: "StartControl"}
                    )}
                />
            </Tooltip>)
            if(x2) controlPoints.push(<Tooltip title={`${x2}, ${y2}`}>
                <circle
                    key={`Segment-${segmentIndex}-EndCP`}
                    className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'EndControl' })}
                    cx={x2 * scale} cy={y2 * scale}
                    onClick={() => handleHighlight({segmentId: segment.segmentId, pointType: "EndControl"})}
                />
            </Tooltip>)
            controlPoints.push(<Tooltip title={`${x}, ${y}`}>
                <circle
                    key={`Segment-${segmentIndex}-EndPoint`}
                    className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'End' })}
                    cx={x * scale} cy={y * scale}
                    onClick={() => handleHighlight({segmentId: segment.segmentId, pointType: 'End'})}
                />
            </Tooltip>)
        })

    }

    return <Box
        component="g"
        className={classes.root}
        sx={{
            [`& .${classes.cpLink}`]: {
                fill: 'none',
                stroke: blueGrey[200],
                strokeWidth: 0.1,
                strokeDasharray: 1
            },
            [`& .${classes.flagAlt}`]: {
                fill: 'none',
                stroke: blueGrey[200],
                strokeWidth: 0.1,
                strokeDasharray: 1
            },

            [`& .${classes.line}`]: {
                fill: 'none',
                stroke: blueGrey[300],
                strokeWidth: 0.25,

                [`&.${classes.lineHighlighted}`]: {
                    stroke: red[300]
                },
            },

            [`& .${classes.controlPoint}`]: {
                stroke: blueGrey[300],
                strokeWidth: 0.1,
                fill: blueGrey[700],
                r: 0.4,
                zIndex: 100,
                boxShadow: theme => theme.shadows[1],
                cursor: 'pointer',

                [`&.${classes.controlPointHighlighted}`]: {
                    fill: red[700]
                },
            },
        }}
    >
        { displayOptions.includes('Raw') && <g className={classes.raw} transform={`scale(${scale})`}>
                <path d={PathSegment.toString(segments)} {...path.presentation}></path>
            </g>
        }
        { displayOptions.includes('Detail') && <>
            <g className={classes.segments}>{lines}</g>
            <g className={classes.controlPoints}>{controlPoints}</g>
        </>}
    </Box>
}
