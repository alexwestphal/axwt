/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {
    Box, ButtonGroup,
    IconButton,
    ToggleButton, Tooltip
} from '@mui/material'
import {blueGrey, red} from '@mui/material/colors'

import GridOffIcon from '@mui/icons-material/GridOff'
import GridOnIcon from '@mui/icons-material/GridOn'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'


import {cls, createClasses} from '@axwt/util'

import {Element, PathSegment, PathSegmentHighlight, PathSegmentId, PointType} from '../data'
import {
    PathSegmentsActions,
    selectCurrentElement,
    selectHighlightedSegment,
    selectSegmentsByPath,
    selectViewBox, useThunkDispatch,
    useTypedSelector
} from '../store'

import {PanelSizingProps} from '@axwt/core/components/ResizeablePanelLayout'
import SVGGrid from './SVGGrid'


export const svgDisplayPanelClasses = createClasses("SVGDisplayPanel", ["container", "controls", "display", "axisLabel"])

export const SVGDisplayPanel: React.FC<PanelSizingProps> = (props) => {

    const viewBox = useTypedSelector(selectViewBox)
    const element = useTypedSelector(selectCurrentElement)

    const [hideGridLines, setHideGridLines] = React.useState(false)


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
                <Tooltip title="Toggle Grid Lines">
                    <ToggleButton
                        size="small"
                        value="hideGridLines"
                        selected={hideGridLines}
                        onChange={() => setHideGridLines(!hideGridLines)}
                    >
                        { hideGridLines ?  <GridOffIcon/> : <GridOnIcon/>}
                    </ToggleButton>
                </Tooltip>

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
                <SVGGrid viewBox={viewBox} showGridLines={!hideGridLines}/>
                { element?.elementType == 'path' && <DrawPath path={element as Element.Path} mode="Detail" scale={scaleRatio}/> }
            </svg>
        </div>
    </Box>
}

export default SVGDisplayPanel



interface DrawPathProps {
    path: Element.Path
    scale: number
    mode: 'Raw' | 'Detail' | 'Both'
}

const drawPathClasses = createClasses("DrawPath", ["controlPoint", "controlPointHighlighted", "cpLink", "flagAlt", "line", "raw", "segments", "segment", "segment_highlight"])

const DrawPath: React.FC<DrawPathProps> = ({path, mode, scale}) => {

    const segments = useTypedSelector(state => selectSegmentsByPath(state, path.elementId))
    const highlight = useTypedSelector(selectHighlightedSegment)

    const dispatch = useThunkDispatch()

    const handleHighlight = (highlight: PathSegmentHighlight) => {
        dispatch(PathSegmentsActions.selectHighlight(highlight))
    }

    const classes = drawPathClasses

    return <Box
        component="g"
        className={classes.root}
        sx={{
            [`& .${classes.segment}`]: {

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
                },

                [`& .${classes.controlPoint}`]: {
                    fill: blueGrey[700],
                    r: 0.4,
                    zIndex: 100,
                    boxShadow: theme => theme.shadows[1],
                    cursor: 'pointer',

                    [`&.${classes.controlPointHighlighted}`]: {
                        fill: red[700]
                    },
                },

                [`&.${classes.segment_highlight}`]: {
                    [`& .${classes.line}`]: {
                        stroke: red[300]
                    },
                },
            },


        }}
    >
        { (mode == 'Raw' || mode == 'Both') && <g className={classes.raw} transform={`scale(${scale})`}>
                <path d={PathSegment.toString(segments)} fill="none" stroke={blueGrey[300]} strokeWidth={0.1}></path>
            </g>
        }
        { (mode == 'Detail' || mode == 'Both') && <g className={classes.segments}>
            {PathSegment
                .withDerivedValues(segments)
                .map((segment, segmentIndex) => {
                    let highlighted = segment.segmentId == highlight?.segmentId

                    let { x0,y0, x,y, x1,y1, x2,y2, startPointReflects } = segment.derived

                    let contents: React.ReactNode[] = []
                    switch(segment.command) {
                        case 'A':
                        case 'a': {
                            let {rx, ry, angle, largeArc, sweep} = segment.arguments
                            contents.push(
                                <path
                                    key="Line"
                                    className={classes.line}
                                    d={`M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc} ${sweep} ${x * scale} ${y * scale}`}
                                />
                            )
                            if(highlight?.largeArc) contents.push(
                                <path
                                    key="largeArcAlt"
                                    className={classes.flagAlt}
                                    d={`M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc ? 0 : 1} ${sweep} ${x * scale} ${y * scale}`}
                                />
                            )
                            if(highlight?.sweep) contents.push(
                                <path
                                    key="sweepAlt"
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
                            contents.push(
                                <path
                                    key="Line"
                                    className={classes.line}
                                    d={`M ${x0 * scale} ${y0 * scale} C ${x1 * scale} ${y1 * scale} ${x2 * scale} ${y2 * scale} ${x * scale} ${y * scale}`}
                                />,
                                <path
                                    key="CPLink1"
                                    className={classes.cpLink}
                                    d={`M ${x0 * scale} ${y0 * scale} L ${x1 * scale} ${y1 * scale}`}
                                />,
                                <path
                                    key="CPLink2"
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
                            contents.push(<path
                                key="Line"
                                className={classes.line}
                                d={`M ${x0 * scale} ${y0 * scale} L ${x * scale} ${y * scale}`}
                            />)
                            break

                        case 'M':
                        case 'm':
                            // Only Need the control point
                            break

                        case 'Q':
                        case 'q':
                        case 'T':
                        case 't':
                            contents.push(
                                <path
                                    key="Line"
                                    className={classes.line}
                                    d={`M ${x0 * scale} ${y0 * scale} Q ${x1 * scale} ${y1 * scale} ${x * scale} ${y * scale}`}
                                />,
                                <path
                                    key="CPLink"
                                    className={classes.cpLink} d={`M ${x0 * scale} ${y0 * scale} L ${x1 * scale} ${y1 * scale} L ${x * scale} ${y * scale}`}
                                />,
                            )
                            break

                    }

                    let reflectedPointHighlighted = !highlighted && startPointReflects && startPointReflects.segmentId == highlight.segmentId && startPointReflects.pointType == highlight.pointType
                    if(x1) contents.push(<circle
                        key="StartControlPoint"
                        className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'StartControl' || reflectedPointHighlighted })}
                        cx={x1 * scale} cy={y1 * scale}
                        onClick={() => handleHighlight(startPointReflects
                            ? {segmentId: startPointReflects.segmentId, pointType: startPointReflects.pointType}
                            : { segmentId: segment.segmentId, pointType: "StartControl"}
                        )}
                    />)
                    if(x2) contents.push(<circle
                        key="EndControlPoint"
                        className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'EndControl' })}
                        cx={x2 * scale} cy={y2 * scale}
                        onClick={() => handleHighlight({segmentId: segment.segmentId, pointType: "EndControl"})}
                    />)
                    contents.push(<circle
                        key="EndPoint"
                        className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'End' })}
                        cx={x * scale} cy={y * scale}
                        onClick={() => handleHighlight({segmentId: segment.segmentId, pointType: 'End'})}
                    />)

                    return <g key={segmentIndex} className={cls(classes.segment, { [classes.segment_highlight]: highlighted })}>{contents}</g>
                })
            }
        </g>}
    </Box>
}
