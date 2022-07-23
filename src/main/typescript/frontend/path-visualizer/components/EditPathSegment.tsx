/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, IconButton, inputClasses, MenuItem, TextField, Tooltip} from '@mui/material'
import {blueGrey} from '@mui/material/colors'
import ClearIcon from '@mui/icons-material/Clear'

import {cls, createClasses} from '@axwt/util'

import {ElementId, PathSegment, PathSegmentId, PathSegmentSymbol, PointType} from '../data'
import {
    PathSegmentsActions,
    selectHighlightedSegment,
    selectSegment,
    useThunkDispatch,
    useTypedSelector
} from '../store'



export interface EditPathSegmentProps {
    pathId: ElementId
    segmentId: PathSegmentId
    first?: boolean
}

export const editPathSegmentClasses = createClasses("EditPathSegment", ["commandSelect", "highlighted", "implicitSpacer", "inputs", "numberInput", "point"])

export const EditPathSegment: React.FC<EditPathSegmentProps> = ({pathId, segmentId, first}) => {

    const segment = useTypedSelector(state => selectSegment(state, segmentId))
    const [highlightedSegmentId, highlightedPointType] = useTypedSelector(selectHighlightedSegment)
    const isHighlighted = highlightedSegmentId == segmentId

    const dispatch = useThunkDispatch()

    const handleFocus = () => {
        if(!isHighlighted) dispatch(PathSegmentsActions.setHighlightedSegment(segmentId))
    }

    const handleDelete = () => {
        // TODO Handle deleting implicit commands properly
        dispatch(PathSegmentsActions.deleteSegment(pathId, segmentId))
    }

    const handleChangeCommand: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        dispatch(PathSegmentsActions.setCommand(segmentId, ev.target.value as PathSegmentSymbol))
    }

    const handleChangeArg = (name: string, value: number) => {
        dispatch(PathSegmentsActions.setArgValue(segmentId, name, value))
    }

    const classes = editPathSegmentClasses

    return <Box
        className={cls(classes.root, { [classes.highlighted]: isHighlighted && !highlightedPointType })}
        onClick={handleFocus}
        sx={{
            paddingTop: 1,
            paddingX: 1,
            display: 'flex',
            borderBottom: 1,
            borderBottomColor: 'divider',

            [`&.${classes.highlighted}`]: {
                backgroundColor: blueGrey[100]
            },

            [`& .${classes.commandSelect}`]: {
                width: '4em',
                textAlign: 'center'
            },
            [`& .${classes.implicitSpacer}`]: {
                width: '4em'
            },
            [`& .${classes.inputs}`]: {
                flexGrow: 1,
                display: 'flex',
            },
            [`& .${classes.numberInput}`]: {
                width: '4em',
                textAlign: 'center',

                [`& .${inputClasses.root}`]: {
                    paddingLeft: 1
                }
            },
            [`& .${classes.point}`]: {
                display: 'flex',

                [`&.${classes.highlighted}`]: {
                    backgroundColor: blueGrey[100]
                },
            },
        }}
    >
        <div className={classes.inputs}>
            <Tooltip title={PathCommandTooltips[segment.command]} placement="top">
                <TextField
                    className={classes.commandSelect}
                    size="small" variant="standard" select
                    label="command"
                    value={segment.command}
                    onChange={handleChangeCommand}
                >
                    <MenuItem value="A" disabled={first}>A</MenuItem>
                    <MenuItem value="a" disabled={first}>a</MenuItem>
                    <MenuItem value="C" disabled={first}>C</MenuItem>
                    <MenuItem value="c" disabled={first}>c</MenuItem>
                    <MenuItem value="H" disabled={first}>H</MenuItem>
                    <MenuItem value="h" disabled={first}>h</MenuItem>
                    <MenuItem value="L" disabled={first}>L</MenuItem>
                    <MenuItem value="l" disabled={first}>l</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="m">m</MenuItem>
                    <MenuItem value="Q" disabled={first}>Q</MenuItem>
                    <MenuItem value="q" disabled={first}>q</MenuItem>
                    <MenuItem value="S" disabled={first}>S</MenuItem>
                    <MenuItem value="s" disabled={first}>s</MenuItem>
                    <MenuItem value="T" disabled={first}>T</MenuItem>
                    <MenuItem value="t" disabled={first}>t</MenuItem>
                    <MenuItem value="V" disabled={first}>V</MenuItem>
                    <MenuItem value="v" disabled={first}>v</MenuItem>
                    <MenuItem value="Z" disabled={first}>Z</MenuItem>
                    <MenuItem value="z" disabled={first}>z</MenuItem>
                </TextField>
            </Tooltip>

            <ArgumentFields
                segment={segment}
                onChangeArg={handleChangeArg}
                onFocusPoint={(pointType) => dispatch(PathSegmentsActions.setHighlightedSegment(segmentId, pointType))}
                highlightedPoint={isHighlighted ? highlightedPointType : undefined}
            />
        </div>
        {!first && <Tooltip title="Delete Command">
            <IconButton onClick={handleDelete}>
                <ClearIcon/>
            </IconButton>
        </Tooltip>}

    </Box>
}

export default EditPathSegment


const PathCommandTooltips = {
    A: "Elliptical Arc Curve (Absolute)",
    a: "Elliptical Arc Curve (Relative)",
    C: "Cubic Bézier Curve (Absolute)",
    c: "Cubic Bézier Curve (Relative)",
    H: "Horizontal Line To (Absolute)",
    h: "Horizontal Line To (Relative)",
    L: "Line To (Absolute)",
    l: "Line To (Relative)",
    M: "Move To (Absolute)",
    m: "move To (Relative)",
    Q: "Quadratic Bézier Curve (Absolute)",
    q: "Quadratic Bézier Curve (Relative)",
    S: "Smooth Cubic Bézier Curve (Absolute)",
    s: "Smooth Cubic Bézier Curve (Relative)",
    T: "Smooth Quadratic Bézier Curve (Absolute)",
    t: "Smooth Quadratic Bézier Curve (Relative)",
    V: "Vertical Line To (Absolute)",
    v: "Vertical Line To (Relative)",
    Z: "Close Path",
    z: "Close Path"
}

interface ArgumentFieldsProps {
    segment: PathSegment
    onChangeArg: (name: string, value: number) => void
    highlightedPoint?: PointType
    onFocusPoint: (pointType: PointType) => void
}

const ArgumentFields: React.FC<ArgumentFieldsProps> = ({segment, onChangeArg, highlightedPoint, onFocusPoint}) => {
    const classes = editPathSegmentClasses
    switch (segment.command) {
        case 'A': {
            let args = segment.arguments
            return <>
                <NumberArgumentField name="rx" value={args.rx} onChange={onChangeArg}/>
                <NumberArgumentField name="ry" value={args.ry} onChange={onChangeArg}/>
                <NumberArgumentField name="angle" value={args.angle} onChange={onChangeArg}/>
                <NumberArgumentField name="largeArcFlag" value={args.largeArcFlag} onChange={onChangeArg}/>
                <NumberArgumentField name="sweepFlag" value={args.sweepFlag} onChange={onChangeArg}/>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="x" value={args.x} onChange={onChangeArg}/>
                    <NumberArgumentField name="y" value={args.y} onChange={onChangeArg}/>
                </div>
            </>
        }
        case 'a': {
            let args = segment.arguments
            return <>
                <NumberArgumentField name="rx" value={args.rx} onChange={onChangeArg}/>
                <NumberArgumentField name="ry" value={args.ry} onChange={onChangeArg}/>
                <NumberArgumentField name="angle" value={args.angle} onChange={onChangeArg}/>
                <NumberArgumentField name="largeArcFlag" value={args.largeArcFlag} onChange={onChangeArg}/>
                <NumberArgumentField name="sweepFlag" value={args.sweepFlag} onChange={onChangeArg}/>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
                </div>
            </>
        }

        case 'C': {
            let args = segment.arguments
            return <>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'StartControl' })}
                    onFocus={() => onFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="x1" value={args.x1} onChange={onChangeArg}/>
                    <NumberArgumentField name="y1" value={args.y1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'EndControl' })}
                    onFocus={() => onFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="x2" value={args.x2} onChange={onChangeArg}/>
                    <NumberArgumentField name="y2" value={args.y2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="x" value={args.x} onChange={onChangeArg}/>
                    <NumberArgumentField name="y" value={args.y} onChange={onChangeArg}/>
                </div>
            </>
        }
        case 'c': {
            let args = segment.arguments
            return <>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'StartControl' })}
                    onFocus={() => onFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="dx1" value={args.dx1} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy1" value={args.dy1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'EndControl' })}
                    onFocus={() => onFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="dx2" value={args.dx2} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy2" value={args.dy2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
                </div>
            </>
        }

        case 'H': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                onFocus={() => onFocusPoint('End')}
            >
                <NumberArgumentField name="x" value={args.x} onChange={onChangeArg}/>
            </div>
        }
        case 'h': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                onFocus={() => onFocusPoint('End')}
            >
                <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
            </div>
        }

        case 'L':
        case 'M':
        case 'T': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                onFocus={() => onFocusPoint('End')}
            >
                <NumberArgumentField name="x" value={args.x} onChange={onChangeArg}/>
                <NumberArgumentField name="y" value={args.y} onChange={onChangeArg}/>
            </div>
        }
        case 'l':
        case 'm':
        case 't': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                onFocus={() => onFocusPoint('End')}
            >
                <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
            </div>
        }

        case 'Q': {
            let args = segment.arguments
            return <>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'StartControl' })}
                    onFocus={() => onFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="x1" value={args.x1} onChange={onChangeArg}/>
                    <NumberArgumentField name="y1" value={args.y1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="x" value={args.x} onChange={onChangeArg}/>
                    <NumberArgumentField name="y" value={args.y} onChange={onChangeArg}/>
                </div>
            </>
        }
        case 'q': {
            let args = segment.arguments
            return <>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'StartControl' })}
                    onFocus={() => onFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="dx1" value={args.dx1} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy1" value={args.dy1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
                </div>
            </>
        }

        case 'S': {
            let args = segment.arguments
            return <>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'EndControl' })}
                    onFocus={() => onFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="x2" value={args.x2} onChange={onChangeArg}/>
                    <NumberArgumentField name="y2" value={args.y2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="x" value={args.x} onChange={onChangeArg}/>
                    <NumberArgumentField name="y" value={args.y} onChange={onChangeArg}/>
                </div>
            </>
        }
        case 's': {
            let args = segment.arguments
            return <>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'EndControl' })}
                    onFocus={() => onFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="dx2" value={args.dx2} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy2" value={args.dy2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                    onFocus={() => onFocusPoint('End')}
                >
                    <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
                </div>

            </>
        }

        case 'V': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                onFocus={() => onFocusPoint('End')}
            >
                <NumberArgumentField name="y" value={args.y} onChange={onChangeArg}/>
            </div>
        }
        case 'v': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlightedPoint == 'End' })}
                onFocus={() => onFocusPoint('End')}
            >
                <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
            </div>
        }

        case 'Z':
        case 'z': return <></>
    }

    return <></>
}


interface NumberArgumentField {
    name: string
    value: number
    onChange: (name, newValue: number) => void
    angle?: boolean
}

const NumberArgumentField: React.FC<NumberArgumentField> = ({name, value, onChange}) => {

    const [currentValue, setCurrentValue] = React.useState("")

    React.useEffect(() => setCurrentValue(""+value), [value])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        let str = ev.target.value
        let negated = str.length > 0 && str.charAt(0) == '-' // Check if the number is negative

        str = str.replaceAll(/[^\d.]/g, '')

        let decimalIndex = str.indexOf('.')
        if(decimalIndex >= 0) {
            // Replace any subsequent occurrences of '.'
            str = str.substring(0, decimalIndex+1) + str.substring(decimalIndex+1).replaceAll('.', '')
        }

        if(negated) str = '-' + str // Put the '-' back on (if required)
        setCurrentValue(str)

        let asNumber = parseFloat(str)
        if(!isNaN(asNumber) && asNumber != value) onChange(name, asNumber)
    }

    const handleBlur = () => {
        let asNumber = parseFloat(currentValue)
        if(isNaN(asNumber)) onChange(name, 0)
    }

    return <TextField
        className={editPathSegmentClasses.numberInput}
        size="small" variant="standard"
        label={name}
        value={currentValue}
        onBlur={handleBlur}
        onChange={handleChange}
    />
}