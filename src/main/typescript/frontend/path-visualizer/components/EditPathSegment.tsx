/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {
    Box, Divider,
    inputClasses, inputLabelClasses,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Tooltip, Typography
} from '@mui/material'
import {blueGrey} from '@mui/material/colors'
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import DeleteIcon from '@mui/icons-material/Delete'
import SplitIcon from '@mui/icons-material/CallSplitOutlined'

import {cls, createClasses} from '@axwt/util'

import {ElementId, PathSegment, PathSegmentHighlight, PathSegmentId, PathSegmentSymbol, PointType} from '../data'
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

export const editPathSegmentClasses = createClasses("EditPathSegment", ["commandSelect", "flag", "flagInput", "highlighted", "implicitSpacer", "inputs", "numberInput", "point"])

export const EditPathSegment: React.FC<EditPathSegmentProps> = ({pathId, segmentId, first}) => {

    const [contextMenu, setContextMenu] = React.useState<{mouseX: number, mouseY: number} | null>(null)

    const segment = useTypedSelector(state => selectSegment(state, segmentId))
    const highlight = useTypedSelector(selectHighlightedSegment)

    const dispatch = useThunkDispatch()

    const handleChangeArg = (name: string, value: number) => {
        dispatch(PathSegmentsActions.setArgValue(segmentId, name, value))
    }

    const handleChangeCommand: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        dispatch(PathSegmentsActions.setCommand(segmentId, ev.target.value as PathSegmentSymbol))
    }

    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        handleFocus()
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: ev.clientX + 2,
                    mouseY: ev.clientY - 6
                }
                : null
        )
    }

    const handleDelete = () => {
        // TODO Handle deleting implicit commands properly
        dispatch(PathSegmentsActions.deleteSegment(pathId, segmentId))
    }

    const handleFocus = () => {
        if(highlight?.segmentId != segmentId || highlight?.pointType != null)
            dispatch(PathSegmentsActions.selectHighlight({segmentId, pointType: null}))
    }

    const handleFocusPoint = (pointType: PointType) => {
        if(highlight.segmentId != segmentId || highlight?.pointType != pointType)
            dispatch(PathSegmentsActions.selectHighlight({segmentId, pointType}))
    }

    const handleFocusFlag = (flag: 'largeArc' | 'sweep') => {
        if(flag == 'largeArc') {
            if(highlight.segmentId != segmentId || highlight?.largeArc !== true) {
                dispatch(PathSegmentsActions.selectHighlight({segmentId, pointType: null, largeArc: true}))
            }
        } else if (flag == 'sweep') {
            if(highlight.segmentId != segmentId || highlight?.sweep !== true) {
                dispatch(PathSegmentsActions.selectHighlight({segmentId, pointType: null, sweep: true}))
            }
        }
    }


    const handleKeyDown = (event: React.KeyboardEvent) => {
        if(event.metaKey) {
            switch(event.key) {
                case 'Backspace':
                    event.preventDefault()
                    handleDelete()
                    break
                case 'c':
                    navigator.clipboard.writeText(PathSegment.toString(segment))
                    break
            }
        }
    }

    const handleNewSegment = () => {
        setContextMenu(null)
        dispatch(PathSegmentsActions.newSegment(pathId, segmentId))
    }

    const classes = editPathSegmentClasses

    return <Box
        className={cls(classes.root, { [classes.highlighted]: highlight?.segmentId == segmentId && !highlight.pointType && !highlight.largeArc && !highlight.sweep })}
        onClick={handleFocus}
        onContextMenu={handleContextMenu}
        onKeyDownCapture={handleKeyDown}
        sx={{
            display: 'flex',
            borderBottom: 1,
            borderBottomColor: 'divider',

            [`&.${classes.highlighted}`]: {
                backgroundColor: blueGrey[50]
            },
            [`& .${classes.flag}`]: {
                [`&.${classes.highlighted}`]: {
                    backgroundColor: blueGrey[50]
                },
            },

            [`& .${classes.flagInput}`]: {
                width: '4em',
                textAlign: 'center',
            },

            [`& .${classes.commandSelect}`]: {
                width: '5em',
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
            },
            [`& .${classes.point}`]: {
                display: 'flex',

                [`&.${classes.highlighted}`]: {
                    backgroundColor: blueGrey[50]
                },
            },

            [`& .${inputClasses.root}`]: {
                paddingTop: 1/21,
                paddingX: 1
            },
            [`& .${inputLabelClasses.root}`]: {
                paddingTop: 1/2,
                paddingX: 1
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
                onFocusPoint={handleFocusPoint}
                onFocusFlag={handleFocusFlag}
                highlight={highlight?.segmentId == segment.segmentId ? highlight : undefined}
            />
        </div>
        <Menu

            open={contextMenu !== null}
            onClose={() => setContextMenu(null)}
            anchorReference="anchorPosition"
            anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        >

            <MenuItem>
                <ListItemIcon>
                    <ContentCutIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Cut
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘X
                </Typography>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <ContentCopyIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Copy
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘C
                </Typography>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <ContentPasteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Paste
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘V
                </Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={handleNewSegment}>
                <ListItemIcon>
                    <AddIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    New Segment
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘N
                </Typography>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <SplitIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Split Segment
                </ListItemText>
            </MenuItem>
            <MenuItem
                onClick={handleDelete}
                disabled={first}
            >
                <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Delete Segment
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={2}>
                    ⌘⌫
                </Typography>
            </MenuItem>
        </Menu>
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
    highlight?: PathSegmentHighlight
    onFocusPoint: (pointType: PointType) => void
    onFocusFlag: (flag: 'largeArc' | 'sweep') => void
}

const ArgumentFields: React.FC<ArgumentFieldsProps> = ({segment, onChangeArg, highlight, onFocusPoint, onFocusFlag}) => {

    const handleFocusPoint = (pointType: PointType) => (event: React.FocusEvent) => {
        event.stopPropagation()
        onFocusPoint(pointType)
    }

    const handleFocusFlag = (flag: 'largeArc' | 'sweep') => (event: React.FocusEvent) => {
        event.stopPropagation()
        onFocusFlag(flag)
    }

    const classes = editPathSegmentClasses

    switch (segment.command) {
        case 'A': {
            let args = segment.arguments
            return <>
                <NumberArgumentField name="rx" value={args.rx} onChange={onChangeArg}/>
                <NumberArgumentField name="ry" value={args.ry} onChange={onChangeArg}/>
                <NumberArgumentField name="angle" value={args.angle} onChange={onChangeArg}/>
                <div
                    className={cls(classes.flag, { [classes.highlighted]: highlight?.largeArc})}
                    onFocus={handleFocusFlag('largeArc')}
                >
                    <FlagArgumentField name="largeArc" value={args.largeArc} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.flag, { [classes.highlighted]: highlight?.sweep })}
                    onFocus={handleFocusFlag('sweep')}
                >
                    <FlagArgumentField name="sweep" value={args.sweep} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
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
                <div
                    className={cls(classes.flag, { [classes.highlighted]: highlight?.largeArc})}
                    onFocus={handleFocusFlag('largeArc')}
                >
                    <FlagArgumentField name="largeArc" value={args.largeArc} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.flag, { [classes.highlighted]: highlight?.sweep })}
                    onFocus={handleFocusFlag('sweep')}
                >
                    <FlagArgumentField name="sweep" value={args.sweep} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
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
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'StartControl' })}
                    onFocus={handleFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="x1" value={args.x1} onChange={onChangeArg}/>
                    <NumberArgumentField name="y1" value={args.y1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'EndControl' })}
                    onFocus={handleFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="x2" value={args.x2} onChange={onChangeArg}/>
                    <NumberArgumentField name="y2" value={args.y2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
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
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'StartControl' })}
                    onFocus={handleFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="dx1" value={args.dx1} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy1" value={args.dy1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'EndControl' })}
                    onFocus={handleFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="dx2" value={args.dx2} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy2" value={args.dy2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
                >
                    <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
                </div>
            </>
        }

        case 'H': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                onFocus={handleFocusPoint('End')}
            >
                <NumberArgumentField name="x" value={args.x} onChange={onChangeArg}/>
            </div>
        }
        case 'h': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                onFocus={handleFocusPoint('End')}
            >
                <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
            </div>
        }

        case 'L':
        case 'M':
        case 'T': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                onFocus={handleFocusPoint('End')}
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
                className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                onFocus={handleFocusPoint('End')}
            >
                <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
            </div>
        }

        case 'Q': {
            let args = segment.arguments
            return <>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'StartControl' })}
                    onFocus={handleFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="x1" value={args.x1} onChange={onChangeArg}/>
                    <NumberArgumentField name="y1" value={args.y1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
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
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'StartControl' })}
                    onFocus={handleFocusPoint('StartControl')}
                >
                    <NumberArgumentField name="dx1" value={args.dx1} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy1" value={args.dy1} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
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
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'EndControl' })}
                    onFocus={handleFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="x2" value={args.x2} onChange={onChangeArg}/>
                    <NumberArgumentField name="y2" value={args.y2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
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
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'EndControl' })}
                    onFocus={handleFocusPoint('EndControl')}
                >
                    <NumberArgumentField name="dx2" value={args.dx2} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy2" value={args.dy2} onChange={onChangeArg}/>
                </div>
                <div
                    className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                    onFocus={handleFocusPoint('End')}
                >
                    <NumberArgumentField name="dx" value={args.dx} onChange={onChangeArg}/>
                    <NumberArgumentField name="dy" value={args.dy} onChange={onChangeArg}/>
                </div>

            </>
        }

        case 'V': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                onFocus={handleFocusPoint('End')}
            >
                <NumberArgumentField name="y" value={args.y} onChange={onChangeArg}/>
            </div>
        }
        case 'v': {
            let args = segment.arguments
            return <div
                className={cls(classes.point, { [classes.highlighted]: highlight?.pointType == 'End' })}
                onFocus={handleFocusPoint('End')}
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
    onChange: (name: string, newValue: number) => void
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
        setCurrentValue(''+value)
    }

    return <TextField
        className={editPathSegmentClasses.numberInput}
        size="small" variant="standard"
        label={name}
        value={currentValue}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={(ev) => ev.stopPropagation()}
    />
}


interface FlagArgumentField {
    name: string
    value: number
    onChange: (name: string, newValue: number) => void
}

const FlagArgumentField: React.FC<FlagArgumentField> = ({name, value, onChange}) => {

    const [blank, setBlank] = React.useState<boolean>(false)

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        let str = ev.target.value
        str = str.replaceAll(/[^01]/g, '')

        if(str.length >= 1) {
            setBlank(false)
            let newValue = parseInt(str.charAt(0))
            if(newValue != value) onChange(name, newValue)
        } else {
            setBlank(true)
        }
    }

    const handleBlur = () => {
        setBlank(false)
    }

    return <TextField
        className={editPathSegmentClasses.flagInput}
        size="small" variant="standard"
        label={name}
        value={blank ? "" : value}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={(ev) => ev.stopPropagation()}
    />
}