/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {Box, Tooltip} from '@mui/material'

import {cls} from '@axwt/util'

import {Element, PathSegment, PathSegmentHighlight} from '../../data'
import {
    PathSegmentsActions,
    selectHighlightedSegment,
    selectSegmentsByPath,
    useThunkDispatch,
    useTypedSelector
} from '../../store'

import {DrawElementComponent, drawElementClasses} from './DrawElement'


export const DrawPath: DrawElementComponent<Element.Path> = ({element, displayOptions, scale}) => {

    const segments = useTypedSelector(state => selectSegmentsByPath(state, element.elementId))
    const highlight = useTypedSelector(selectHighlightedSegment)

    const dispatch = useThunkDispatch()

    const handleHighlight = (highlight: PathSegmentHighlight) => {
        dispatch(PathSegmentsActions.selectHighlight(highlight))
    }

    const classes = drawElementClasses


    const lines: React.ReactNode[] = [], controlPoints: React.ReactNode[] = []

    if(displayOptions.includes('Detail')) {
        PathSegment.withDerivedValues(segments).forEach((segment, segmentIndex) => {
            let highlighted = segment.segmentId == highlight?.segmentId
            let segmentString = PathSegment.toString(segment)

            let { x0,y0, x,y, x1,y1, x2,y2, startPointReflects } = segment.derived

            const buildPath = (d: string): React.ReactNode => <Tooltip title={segmentString} key={`Segment-${segmentIndex}-Line`}>
                <path className={cls(classes.line, { [classes.lineHighlighted]: highlighted })} d={d}/>
            </Tooltip>

            switch(segment.command) {
                case 'A':
                case 'a': {
                    let {rx, ry, angle, largeArc, sweep} = segment.arguments
                    lines.push(buildPath(
                        `M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc} ${sweep} ${x * scale} ${y * scale}`
                    ))
                    if(highlight?.largeArc) lines.push(<Tooltip title={`largeArc = ${largeArc ? 0 : 1}`} key={`Segment-${segmentIndex}-LargeArcAlt`}>
                        <path
                            className={classes.flagAlt}
                            d={`M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc ? 0 : 1} ${sweep} ${x * scale} ${y * scale}`}
                        />
                    </Tooltip>)
                    if(highlight?.sweep) lines.push(<Tooltip title={`sweep = ${sweep ? 0 : 1}`} key={`Segment-${segmentIndex}-SweepAlt`}>
                        <path
                            className={classes.flagAlt}
                            d={`M ${x0 * scale} ${y0 * scale} A ${rx * scale} ${ry * scale} ${angle} ${largeArc} ${sweep ? 0 : 1} ${x * scale} ${y * scale}`}
                        />
                    </Tooltip>)
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
            if(x1) controlPoints.push(<Tooltip title={`${x1}, ${y1}`} key={`Segment-${segmentIndex}-StartCP`}>
                <circle
                    className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'StartControl' || reflectedPointHighlighted })}
                    cx={x1 * scale} cy={y1 * scale}
                    onClick={() => handleHighlight(startPointReflects
                        ? {segmentId: startPointReflects.segmentId, pointType: startPointReflects.pointType}
                        : { segmentId: segment.segmentId, pointType: "StartControl"}
                    )}
                />
            </Tooltip>)
            if(x2) controlPoints.push(<Tooltip title={`${x2}, ${y2}`} key={`Segment-${segmentIndex}-EndCP`}>
                <circle
                    className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'EndControl' })}
                    cx={x2 * scale} cy={y2 * scale}
                    onClick={() => handleHighlight({segmentId: segment.segmentId, pointType: "EndControl"})}
                />
            </Tooltip>)
            controlPoints.push(<Tooltip title={`${x}, ${y}`} key={`Segment-${segmentIndex}-EndPoint`}>
                <circle
                    className={cls(classes.controlPoint, { [classes.controlPointHighlighted]: highlighted && highlight.pointType == 'End' })}
                    cx={x * scale} cy={y * scale}
                    onClick={() => handleHighlight({segmentId: segment.segmentId, pointType: 'End'})}
                />
            </Tooltip>)
        })

    }

    return <Box
        component="g"
        className={cls(classes.root, classes.pathElement)}
    >
        { displayOptions.includes('Raw') && <g className={classes.raw} transform={`scale(${scale})`}>
            <path d={PathSegment.toString(segments)} {...element.presentation}></path>
        </g>
        }
        { displayOptions.includes('Detail') && <>
            <g className={classes.segments}>{lines}</g>
            <g className={classes.controlPoints}>{controlPoints}</g>
        </>}
    </Box>
}

export default DrawPath