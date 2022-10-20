
import * as React from 'react'

import {Box} from '@mui/material'

import {ArrayUtils, cls, createClasses} from '@axwt/util'
import {blue, blueGrey, orange, red} from '@mui/material/colors'

import {Sudoku} from '../data'


export interface SudokuBoardProps {
    n: number
    onKeyDown?: React.KeyboardEventHandler
    onClick?: (ev: React.MouseEvent & { boardX: number, boardY: number }) => void
    onBlur?: React.FocusEventHandler
    houseHighlight?: Sudoku.House
}

export const sudokuBoardClasses = createClasses("SudokuBoard", [
    "cell", "cellBackground", "cellCandidate", "cellCandidate_clear", "cellCandidate_highlight",
    "cellHighlight_active", "cellHighlight_match", "cellHighlight_indicate",
    "cellValue", "cellValue_conflict", "cellValue_guess", "cellValue_known", "cellValue_user",
    "gridBorder", "gridLineMajor", "gridLineMinor", "house_highlight"
])

export const SudokuBoard: React.FC<SudokuBoardProps> = ({children, n, onClick, onBlur, onKeyDown, houseHighlight}) => {

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
                [`& .${classes.cellCandidate}`]: {
                    fill: blueGrey[500],
                    alignmentBaseline: 'central',
                    textAnchor: 'middle',
                },
                [`& .${classes.cellCandidate_clear}`]: {
                    fill: 'transparent',
                    stroke: red[300],
                    strokeWidth: 0.25,
                },
                [`& .${classes.cellCandidate_highlight}`]: {
                    fill: 'transparent',
                    stroke: red[300],
                    strokeWidth: 0.25,
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
                [`& .${classes.cellValue_conflict}`]: {
                    fill: red[500],
                },
                [`& .${classes.cellValue_guess}`]: {
                    fill: orange[500],
                },
                [`& .${classes.cellValue_known}`]: {

                },
                [`& .${classes.cellValue_user}`]: {
                    fill: blue[500],
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
                [`& .${classes.house_highlight}`]: {
                    fill: 'transparent',
                    stroke: red[300],
                    strokeWidth: 0.25
                },
            }}
        >
            <BoardGrid n={n}/>
            {children}
            {houseHighlight && <HighlightHouse n={n} house={houseHighlight}/>}
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
    valueType?: Sudoku.CellValueType
    highlight: 'none' | 'active' | 'indicate' | 'match'
    candidates?: ReadonlyArray<number>
    highlightedCandidates?: ReadonlyArray<number>
    clearedCandidates?: ReadonlyArray<number>
}

export const BoardCell: React.FC<BoardCellProps> = ({n, x, y, value, valueType, highlight, candidates = [], highlightedCandidates = [], clearedCandidates = []}) => {
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
                [classes.cellValue_known]: valueType == 'Known',
                [classes.cellValue_guess]: valueType == 'Guess',
                [classes.cellValue_user]: valueType == 'User',
                [classes.cellValue_conflict]: valueType == 'Known-Conflict' || valueType == 'User-Conflict',
            })} fontSize={w*.75}
            x={(x+.5)*w} y={(y+.5)*w}
        >{value}</text>}
        {candidates.length > 0 && <CellCandidates
            n={n} x={x} y={y}
            candidates={candidates}
            highlightedCandidates={highlightedCandidates}
            clearedCandidates={clearedCandidates}
        />}
    </g>
}

interface CellNotesProps {
    n: number
    x: number
    y: number
    candidates: ReadonlyArray<number>
    highlightedCandidates: ReadonlyArray<number>
    clearedCandidates: ReadonlyArray<number>
}

export const CellCandidates: React.FC<CellNotesProps> = ({n, x, y, candidates, highlightedCandidates, clearedCandidates}) => {
    let w = 100/(n*n) // Cell width (in SVG coord space)
    let sw = w*.8/n // Sub cell width

    const classes = sudokuBoardClasses
    return <>
        {ArrayUtils.range(0, n*n).filter(i => candidates.includes(i+1)).map(i => {
            let sx = i % n, sy = Math.floor(i / n)

            let cx = (x+.1)*w + (sx+.5)*sw
            let cy = (y+.1)*w + (sy+.5)*sw

            return <React.Fragment key={i}>
                {highlightedCandidates.includes(i+1) && <circle
                    className={classes.cellCandidate_highlight}
                    cx={cx} cy={cy} r={sw/2}
                />}
                {clearedCandidates.includes(i+1) && <line
                    className={classes.cellCandidate_clear}
                    x1={cx - sw/2} y1={cy + sw/2}
                    x2={cx + sw/2} y2={cy - sw/2}
                />}
                <text
                    className={classes.cellCandidate}
                    fontSize={w*.75/n}
                    x={cx} y={cy}
                >{i+1}</text>
            </React.Fragment>
        })}
    </>
}


interface HighlightHouseProps {
    n: number
    house: Sudoku.House
}

export const HighlightHouse: React.FC<HighlightHouseProps> = ({n, house}) => {
    let props = { x: 0, y: 0, width: 100, height: 100 }
    switch (house.houseType) {
        case 'Column': {
            let w = 100 / (n * n)
            props = {x: house.x * w + .5, y: .5, width: w-1, height: 99}
            break
        }
        case 'Row': {
            let h = 100 / (n * n)
            props = {x: .5, y: house.y * h + .5, width: 99, height: h-1}
            break
        }
        case 'Block': {
            let s = 100 / n
            props = { x: house.bx * s + .5, y: house.by * s + .5, width: s-1, height: s-1 }
            break
        }

    }

    return <rect className={sudokuBoardClasses.house_highlight} rx={2} ry={2} {...props}/>
}
