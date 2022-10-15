
import * as React from 'react'

import {Box} from '@mui/material'

import {ArrayUtils, cls, createClasses} from '@axwt/util'
import {blue, blueGrey, green, red} from '@mui/material/colors'


export interface SudokuBoardProps {
    n: number
    onKeyDown?: React.KeyboardEventHandler
    onClick?: (ev: React.MouseEvent & { boardX: number, boardY: number }) => void
    onBlur?: React.FocusEventHandler
}

export const sudokuBoardClasses = createClasses("SudokuBoard", [
    "cell", "cellBackground", "cellNote", "cellHighlight_active", "cellHighlight_match", "cellHighlight_indicate",
    "cellValue", "cellValue_guess", "cellValue_wrong", "cellValue_delete", "cellValue_correct",
    "gridBorder", "gridLineMajor", "gridLineMinor"
])

export const SudokuBoard: React.FC<SudokuBoardProps> = ({children, n, onClick, onBlur, onKeyDown}) => {

    const handleClick: React.MouseEventHandler<SVGElement> = (ev) => {
        if(onClick) {
            let rect = ev.currentTarget.getBoundingClientRect()

            let scalingFactor = 100 * (100/100.25)

            let x = (ev.clientX - rect.x) / rect.width * scalingFactor + .125
            let y = (ev.clientY - rect.y) / rect.height * scalingFactor + .125

            onClick({...ev, boardX: x, boardY: y})
        }
    }

    const handleBlur: React.FocusEventHandler = (ev) => {
        if(onBlur) onBlur(ev)
    }

    const handleKeyDown: React.KeyboardEventHandler = (ev) => {
        if(onKeyDown) onKeyDown(ev)
    }

    const classes = sudokuBoardClasses
    return <svg
        className={classes.root}
        viewBox={`-.125 -.125 100.25 100.25`}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={0}
    >
        <Box
            component="g"
            sx={{
                position: 'relative',
                cursor: 'pointer',

                [`& .${classes.cellBackground}`]: {
                    fill: 'none',
                    opacity: 0.5,
                },
                [`& .${classes.cellNote}`]: {
                    fill: blueGrey[500],
                    alignmentBaseline: 'central',
                    textAnchor: 'middle',
                },
                [`& .${classes.cellHighlight_active}`]: {
                    fill: blueGrey[200],
                },
                [`& .${classes.cellHighlight_indicate}`]: {
                    fill: blueGrey[100],
                },
                [`& .${classes.cellHighlight_match}`]: {
                    fill: blueGrey[500],
                },
                [`& .${classes.cellValue}`]: {
                    alignmentBaseline: 'central',
                    textAnchor: 'middle',
                },
                [`& .${classes.cellValue_guess}`]: {
                    fill: blue[500],
                },
                [`& .${classes.cellValue_wrong}`]: {
                    fill: red[500],
                },
                [`& .${classes.cellValue_delete}`]: {
                    fill: red[500],
                    textDecoration: "line-through",
                },
                [`& .${classes.cellValue_correct}`]: {
                    fill: green[900],
                },

                [`& .${classes.gridBorder}`]: {
                    fill: 'none',
                    stroke: blueGrey[800],
                    strokeWidth: 0.25
                },
                [`& .${classes.gridLineMajor}`]: {
                    stroke: blueGrey[800],
                    strokeWidth: 0.25,
                },
                [`& .${classes.gridLineMinor}`]: {
                    stroke: blueGrey[300],
                    strokeWidth: 0.125,
                },
            }}
        >
            <BoardGrid n={n}/>
            {children}
        </Box>
    </svg>
}

export default SudokuBoard


export interface BoardGridProps {
    n: number
}

export const BoardGrid: React.FC<BoardGridProps> = ({n}) => {
    let w = 100/(n*n) // Cell width (in SVG coord space)

    const classes = sudokuBoardClasses
    return <>
        {ArrayUtils.range(1, n*n).filter(i => i % n != 0).map(i => {
            return <React.Fragment key={i}>
                <line
                    className={classes.gridLineMinor}
                    x1={i*w} y1={0}
                    x2={i*w} y2={100}
                />
                <line
                    className={classes.gridLineMinor}
                    x1={0}   y1={i*w}
                    x2={100} y2={i*w}
                />
            </React.Fragment>
        })}
        {ArrayUtils.range(1, n*n).filter(i => i % n == 0).map(i => {
            return <React.Fragment key={i}>
                <line
                    className={classes.gridLineMajor}
                    x1={i*w} y1={0}
                    x2={i*w} y2={100}
                />
                <line
                    className={classes.gridLineMajor}
                    x1={0}   y1={i*w}
                    x2={100} y2={i*w}
                />
            </React.Fragment>
        })}
        <path className={classes.gridBorder} d="M 0 0 H 100 V 100 H 0 Z"/>
    </>
}

export interface BoardCellProps {
    n: number
    x: number
    y: number
    value: number
    valueColor?: 'value' | 'guess' | 'wrong' | 'delete' | 'correct'
    highlight: 'none' | 'active' | 'indicate' | 'match'
    notes?: number[]
}

export const BoardCell: React.FC<BoardCellProps> = ({n, x, y, value, valueColor, highlight, notes = []}) => {
    let w = 100/(n*n) // Cell width (in SVG coord space)

    const classes = sudokuBoardClasses
    return <g className={classes.cell}>
        <path

            className={cls(classes.cellBackground, {
                [classes.cellHighlight_active]: highlight == 'active',
                [classes.cellHighlight_indicate]: highlight == 'indicate',
                [classes.cellHighlight_match]: highlight == 'match',
            })}
            d={`M ${x*w} ${y*w} h${w} v${w} h${-w} z`}
        />
        {value > 0 && <text
            className={cls(classes.cellValue, {
                [classes.cellValue_guess]: valueColor == 'guess',
                [classes.cellValue_wrong]: valueColor == 'wrong',
                [classes.cellValue_delete]: valueColor == 'delete',
                [classes.cellValue_correct]: valueColor == 'correct',
            })} fontSize={w*.75}
            x={(x+.5)*w} y={(y+.5)*w}
        >{value}</text>}
        {notes.length > 0 && <CellNotes n={n} x={x} y={y} notes={notes}/>}
    </g>
}

interface CellNotesProps {
    n: number
    x: number
    y: number
    notes: number[]
}

export const CellNotes: React.FC<CellNotesProps> = ({n, x, y, notes}) => {
    let w = 100/(n*n) // Cell width (in SVG coord space)
    let sw = w*.8/n // Sub cell width

    const classes = sudokuBoardClasses
    return <>
        {ArrayUtils.range(0, n*n).filter(i => notes.includes(i+1)).map(i => {
            let sx = i % n, sy = Math.floor(i / n)
            return <text
                key={i}
                className={classes.cellNote}
                fontSize={w*.75/n}
                x={ (x+.1)*w + (sx+.5)*sw }
                y={ (y+.1)*w + (sy+.5)*sw }
            >{i+1}</text>
        })}
    </>
}