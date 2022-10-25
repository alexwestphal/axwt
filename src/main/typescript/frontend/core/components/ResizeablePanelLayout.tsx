
import * as React from 'react'

import {Box, Button, Collapse, ToggleButton, useTheme} from '@mui/material'
import {grey} from '@mui/material/colors'
import {lighten, Theme} from '@mui/material/styles'

import DragHandleIcon from '@mui/icons-material/DragHandle'

import {cls, createClasses, useWindowSize} from '@axwt/util'

import DragHandleVerticalIcon from '../icons/DragHandleVertical'



const restrict = (value: number, lowerBound: number, upperBound: number) =>
    value < lowerBound ? lowerBound : value > upperBound ? upperBound : value

export interface PanelSizingProps {
    width: number
    height: number
    collapsePanel?: () => void
}

export interface SidePanelSpec {
    Component: React.ComponentType<PanelSizingProps>
    label: string
    available?: boolean
}

export interface LayoutProps {

    leftSide?: {
        panels: SidePanelSpec[]
        adjustable?: boolean
        width?: number
    }
    rightSide?: {
        panels: SidePanelSpec[]
        adjustable?: boolean
        width?: number
    }
    bottom?: {
        Component: React.ComponentType<PanelSizingProps>
        adjustable?: boolean

        height?: number
    }
    main: {
        Component: React.ComponentType<PanelSizingProps>
    }
}

const FrameBarWidth = 32
const HeaderHeight = 48
const BottomPanelMinHeightF = 0.1
const MainPanelMinHeightF = 0.2
const MainPanelMinWidthF = 0.2
const SidePanelMinWidthF = 0.2


const classes = createClasses("RPL", [
    "frameBar", "frameBar_inner", "frameBar_buttonSelected",
    "resizeBorder", "resizeBorder_column", "resizeBorder_row",
    "resizeHandle", "resizeHandle_column", "resizeHandle_row",
    "panelBottom", "panelLeft", "panelMain", "panelRight", "panelColumn", "panelRow",

])

export const ResizeablePanelLayout: React.FC<LayoutProps> = (props) => {

    const banner = useTheme<Theme>().banner

    const { width: windowWidth, height: windowHeight } = useWindowSize()

    const [bottomPanelOpen, setBottomPanelOpen] = React.useState(false)
    const [leftPanelOpen, setLeftPanelOpen] = React.useState(true)
    const [rightPanelOpen, setRightPanelOpen] = React.useState(true)

    const [leftPanelIndex, setLeftPanelIndex] = React.useState<number>(0)
    const [rightPanelIndex, setRightPanelIndex] = React.useState<number>(0)

    // We store the panel sizes as fractions of the screen size
    const [leftPanelWidthF, setLeftPanelWidthF] = React.useState(props.leftSide?.width ?? 0.25)
    const [rightPanelWidthF, setRightPanelWidthF] = React.useState(props.rightSide?.width ?? 0.25)
    const [bottomPanelHeightF, setBottomPanelHeightF] = React.useState(0.25)

    const [activeHandle, setActiveHandle] = React.useState<'Left' | 'Right' | 'Bottom'>(null)

    const handleLeftSideTabClick = (panelIndex: number) => {
        if(panelIndex == leftPanelIndex) {
            setLeftPanelOpen(!leftPanelOpen)
        } else if(leftPanelOpen) {
            setLeftPanelIndex(panelIndex)
        } else {
            setLeftPanelIndex(panelIndex)
            setLeftPanelOpen(true)
        }
    }

    const handleRightSideTabClick = (panelIndex: number) => {
        if(panelIndex == rightPanelIndex) {
            setRightPanelOpen(!rightPanelOpen)
        } else if(rightPanelOpen) {
            setRightPanelIndex(panelIndex)
        } else {
            setRightPanelIndex(panelIndex)
            setRightPanelOpen(true)
        }
    }

    const handleMouseMove: React.MouseEventHandler = (ev) => {
        if(activeHandle) {
            switch(activeHandle) {
                case 'Left': {
                    // The maximum size of the left panel is the remainder after the rightPanel width and mainPanel minWidth
                    let maxPanelWidthF = 1.0 - rightPanelWidthF - MainPanelMinWidthF

                    // The requested size (based on the mouse position)
                    let requestedWidthF = (ev.clientX - FrameBarWidth) / windowWidth

                    // The width (fraction) after constraints
                    let newLeftWidthF = restrict(requestedWidthF, SidePanelMinWidthF, maxPanelWidthF)

                    setLeftPanelWidthF(newLeftWidthF)
                    break
                }
                case 'Right': {
                    // The maximum size of the right panel is the remainder after leftPanel width and mainPanel minWidth
                    let maxPanelWidthF = 1 - leftPanelWidthF - MainPanelMinWidthF

                    // The requested size (based on mouse position)
                    let requestedWidthF = (windowWidth - ev.clientX - FrameBarWidth) / windowWidth

                    // The width (fraction) after constraints
                    let newRightWidthF = restrict(requestedWidthF, SidePanelMinWidthF, maxPanelWidthF)

                    setRightPanelWidthF(newRightWidthF)
                    break
                }
                case 'Bottom': {
                    // The maximum size of the bottom panel is the remainder after the header and mainPanel minWidth
                    let maxPanelHeightF = 1 - (HeaderHeight/windowHeight) - MainPanelMinHeightF

                    // The requested size (based on mouse position)
                    let requestedHeightF = (windowHeight - ev.clientY) / windowHeight

                    // The height (fraction) after constraints
                    let newHeightF = restrict(requestedHeightF, BottomPanelMinHeightF, maxPanelHeightF)

                    setBottomPanelHeightF(newHeightF)
                    break
                }
            }
        }
    }

    let mainPanelWidth = windowWidth
    if(props.leftSide) mainPanelWidth -= leftPanelOpen ? leftPanelWidthF * windowWidth + FrameBarWidth : FrameBarWidth
    if(props.rightSide) mainPanelWidth -= rightPanelOpen ? rightPanelWidthF * windowWidth + FrameBarWidth : FrameBarWidth

    const mainPanelHeight = bottomPanelOpen ? (1 - bottomPanelHeightF) * (windowHeight - banner.height) : (windowHeight - banner.height)

    const bottomPanelProps: PanelSizingProps = { width: windowWidth, height: bottomPanelHeightF * (windowHeight - banner.height - 1) }

    const bottomPanel = <>
        <div className={cls(classes.resizeBorder, classes.resizeBorder_row)} onMouseDown={() => setActiveHandle('Bottom')}>
            <div className={cls(classes.resizeHandle, classes.resizeHandle_row)}>
                <DragHandleIcon/>
            </div>
        </div>
        <div className={classes.panelBottom} style={{height: bottomPanelHeightF*(windowHeight - banner.height)}}>{props.bottom && React.createElement(props.bottom.Component, bottomPanelProps)}</div>
    </>

    const leftPanelProps: PanelSizingProps = { width: leftPanelWidthF*windowWidth - 1, height: mainPanelHeight, collapsePanel: () => setLeftPanelOpen(false) }

    const leftPanel = props.leftSide && <>
        <div className={classes.frameBar}>
            <div className={classes.frameBar_inner}>
                {props.leftSide.panels.map((panelSpec, panelIndex) =>
                    <ToggleButton
                        key={panelIndex}
                        size="small" value={''+panelIndex} sx={{ border: 'none' }}
                        selected={leftPanelOpen && leftPanelIndex == panelIndex}
                        onChange={() => handleLeftSideTabClick(panelIndex)}
                    >{panelSpec.label}</ToggleButton>
                )}
            </div>
        </div>
        { leftPanelOpen && <>
            <div className={classes.panelLeft} style={{width: leftPanelProps.width}}>{ leftPanelOpen && React.createElement(props.leftSide.panels[leftPanelIndex].Component, leftPanelProps)}</div>
            <div className={cls(classes.resizeBorder, classes.resizeBorder_column)} onMouseDown={() => setActiveHandle('Left')}>
                <div className={cls(classes.resizeHandle, classes.resizeHandle_column)}>
                    <DragHandleVerticalIcon/>
                </div>
            </div>
        </>}
    </>

    const mainPanelProps: PanelSizingProps = { width: mainPanelWidth, height: mainPanelHeight }

    const mainPanel = <main className={classes.panelMain} style={{height: mainPanelHeight}}>{React.createElement(props.main.Component, mainPanelProps)}</main>

    const rightPanelProps: PanelSizingProps = { width: rightPanelWidthF*windowWidth - 1, height: mainPanelHeight, collapsePanel: () => setRightPanelOpen(false) }

    const rightPanel = props.rightSide && <>
        { rightPanelOpen && <>
            <div className={cls(classes.resizeBorder, classes.resizeBorder_column)} onMouseDown={() => setActiveHandle('Right')}>
                <div className={cls(classes.resizeHandle, classes.resizeHandle_column)}>
                    <DragHandleVerticalIcon/>
                </div>
            </div>
            <div className={classes.panelRight} style={{width: rightPanelProps.width}}>{ props.rightSide && React.createElement(props.rightSide.panels[0].Component, rightPanelProps)}</div>
        </>}
        <div className={classes.frameBar}>
            <div className={classes.frameBar_inner}>
                { props.rightSide.panels.map((panelSpec, panelIndex) =>
                    <ToggleButton
                        key={panelIndex}
                        size="small" value={''+panelIndex} sx={{ border: 'none' }}
                        selected={rightPanelOpen && rightPanelIndex == panelIndex}
                        onChange={() => handleRightSideTabClick(panelIndex)}
                    >{panelSpec.label}</ToggleButton>
                )}
            </div>
        </div>
    </>

    return <Box
        onMouseMove={handleMouseMove}
        onMouseUp={() => setActiveHandle(null)}
        sx={{
            width: '100%',
            height: `calc(100vh - ${banner.height}px)`,
            marginTop: `${banner.height}px`,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            overflow: 'hidden',

            [`& .${classes.frameBar}`]: theme => ({
                position: 'relative',
                width: FrameBarWidth+'px',
                borderRight: 1,
                borderRightColor: 'divider',
                boxShadow: theme.shadows[1],
                // transform: 'rotate(-90deg)',
                // transformOrigin: 'top ',
            }),
            [`& .${classes.frameBar_inner}`]: {
                position: 'absolute',
                bottom: 0, left: FrameBarWidth,
                display: 'flex',
                flexDirection: 'row-reverse',
                width: mainPanelHeight+'px',
                height: FrameBarWidth+'px',
                alignItems: 'stretch',
                transform: `rotate(-90deg)`,
                transformOrigin: 'bottom left',

            },
            [`& .${classes.frameBar_buttonSelected}`]: {
                backgroundColor: grey[400]
            },

            [`& .${classes.resizeBorder}`]: {
                display: 'flex', justifyContent: 'center',
                backgroundColor: 'divider'
            },

            [`& .${classes.resizeBorder_column}`]: {},

            [`& .${classes.resizeBorder_column}`]: {
                flexDirection: 'column',
                width: '1px',
                cursor: 'col-resize'
            },
            [`& .${classes.resizeBorder_row}`]: {
                flexDirection: 'row',
                height: '1px',
                cursor: 'row-resize'
            },
            [`& .${classes.resizeHandle}`]: theme => ({
                borderRadius: '6px',
                backgroundColor: 'whitesmoke',
                borderColor: `divider`,
                color: lighten(theme.palette.text.primary, 0.5),
                boxShadow: theme.shadows[1],
                zIndex: 100,
            }),
            [`& .${classes.resizeHandle_column}`]: {
                width: '16px', height: '26px',
                marginLeft: '-8.5px',
                "& > svg": { marginLeft: '-5px' }
            },
            [`& .${classes.resizeHandle_row}`]: {
                width: '26px', height: '16px',
                marginTop: '-8.5px',
                "& > svg": { marginTop: '-5px' }
            },
            [`& .${classes.panelBottom}`]: {
                flexShrink: 0
            },

            [`& .${classes.panelLeft}`]: {
            },

            [`& .${classes.panelMain}`]: {
                flexGrow: 1,
                overflow: 'hidden',
                backgroundColor: grey[50]
            },
            [`& .${classes.panelRight}`]: {
            },

            [`& .${classes.panelColumn}`]: {
                display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                flexGrow: 1
            },
            [`& .${classes.panelRow}`]: {
                display: 'flex', flexDirection: 'row', alignItems: 'stretch',
                flexGrow: 1
            }
        }}
    >
        <div className={classes.panelColumn}>
            <div className={classes.panelRow}>
                { leftPanel }
                { mainPanel }
                { rightPanel }
            </div>
            { props.bottom && bottomPanel }
        </div>

    </Box>
}

export default ResizeablePanelLayout
