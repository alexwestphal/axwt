
import * as React from 'react'

import {Box, useTheme} from '@mui/material'
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
}

export interface LayoutProps {

    leftPanel?: {
        Component: React.ComponentType<PanelSizingProps>
        adjustable?: boolean
        width?: number
    }
    rightPanel?: {
        Component: React.ComponentType<PanelSizingProps>
        adjustable?: boolean
        width?: number
    }
    bottomPanel?: {
        Component: React.ComponentType<PanelSizingProps>
        adjustable?: boolean

        height?: number
    }
    mainPanel: {
        Component: React.ComponentType<PanelSizingProps>
    }
}

const HeaderHeight = 48
const BottomPanelMinHeightF = 0.1
const MainPanelMinHeightF = 0.2
const MainPanelMinWidthF = 0.2
const SidePanelMinWidthF = 0.2


const classes = createClasses("RPL", [
    "resizeBorder", "resizeBorder_column", "resizeBorder_row",
    "resizeHandle", "resizeHandle_column", "resizeHandle_row",
    "panelBottom", "panelLeft", "panelMain", "panelRight", "panelColumn", "panelRow"
])

export const ResizeablePanelLayout: React.FC<LayoutProps> = (props) => {

    const banner = useTheme<Theme>().banner

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null)
    const handleMenuClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        setMenuAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => setMenuAnchorEl(null)


    const { width: windowWidth, height: windowHeight } = useWindowSize()


    const [leftPanelOpen, setLeftPanelOpen] = React.useState(false)
    const [rightPanelOpen, setRightPanelOpen] = React.useState(false)
    const [bottomPanelOpen, setBottomPanelOpen] = React.useState(false)

    // We store the panel sizes as fractions of the screen size
    const [leftPanelWidthF, setLeftPanelWidthF] = React.useState(props.leftPanel?.width ?? 0.25)
    const [rightPanelWidthF, setRightPanelWidthF] = React.useState(props.rightPanel?.width ?? 0.25)
    const [bottomPanelHeightF, setBottomPanelHeightF] = React.useState(0.25)

    const [activeHandle, setActiveHandle] = React.useState<'Left' | 'Right' | 'Bottom'>(null)

    const handleToggleSidePanelOpen = () => {}

    const handleMouseMove: React.MouseEventHandler = (ev) => {
        if(activeHandle) {
            switch(activeHandle) {
                case 'Left': {
                    // The maximum size of the left panel is the remainder after the rightPanel width and mainPanel minWidth
                    let maxPanelWidthF = 1.0 - rightPanelWidthF - MainPanelMinWidthF

                    // The requested size (based on the mouse position)
                    let requestedWidthF = ev.clientX / windowWidth

                    // The width (fraction) after constraints
                    let newLeftWidthF = restrict(requestedWidthF, SidePanelMinWidthF, maxPanelWidthF)

                    setLeftPanelWidthF(newLeftWidthF)
                    break
                }
                case 'Right': {
                    // The maximum size of the right panel is the remainder after leftPanel width and mainPanel minWidth
                    let maxPanelWidthF = 1 - leftPanelWidthF - MainPanelMinWidthF

                    // The requested size (based on mouse position)
                    let requestedWidthF = (windowWidth - ev.clientX) / windowWidth

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

    const mainPanelHeight =  bottomPanelOpen ? (1 - bottomPanelHeightF) * (windowHeight - banner.height) : (windowHeight - banner.height)

    const bottomPanelProps = { width: windowWidth, height: bottomPanelHeightF * (windowHeight - banner.height - 1) }

    const bottomPanel = <>
        <div className={cls(classes.resizeBorder, classes.resizeBorder_row)} onMouseDown={() => setActiveHandle('Bottom')}>
            <div className={cls(classes.resizeHandle, classes.resizeHandle_row)}>
                <DragHandleIcon/>
            </div>
        </div>
        <div className={classes.panelBottom} style={{height: bottomPanelHeightF*(windowHeight - banner.height)}}>{props.bottomPanel && React.createElement(props.bottomPanel.Component, bottomPanelProps)}</div>
    </>

    const leftPanelProps: PanelSizingProps = { width: leftPanelWidthF*windowWidth - 1, height: mainPanelHeight }

    const leftPanel = <>
        <div className={classes.panelLeft} style={{width: leftPanelProps.width}}>{ props.leftPanel && React.createElement(props.leftPanel.Component, leftPanelProps)}</div>
        <div className={cls(classes.resizeBorder, classes.resizeBorder_column)} onMouseDown={() => setActiveHandle('Left')}>
            <div className={cls(classes.resizeHandle, classes.resizeHandle_column)}>
                <DragHandleVerticalIcon/>
            </div>
        </div>
    </>

    const mainPanelProps: PanelSizingProps = { width: (1 - leftPanelWidthF - rightPanelWidthF) * windowWidth, height: mainPanelHeight }

    const mainPanel = <main className={classes.panelMain} style={{height: mainPanelHeight}}>{React.createElement(props.mainPanel.Component, mainPanelProps)}</main>

    const rightPanelProps: PanelSizingProps = { width: rightPanelWidthF*windowWidth - 1, height: mainPanelHeight }

    const rightPanel = <>
        <div className={cls(classes.resizeBorder, classes.resizeBorder_column)} onMouseDown={() => setActiveHandle('Right')}>
            <div className={cls(classes.resizeHandle, classes.resizeHandle_column)}>
                <DragHandleVerticalIcon/>
            </div>
        </div>
        <div className={classes.panelRight} style={{width: rightPanelProps.width}}>{ props.rightPanel && React.createElement(props.rightPanel.Component, rightPanelProps)}</div>
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
                { props.leftPanel && leftPanel }
                { mainPanel }
                { props.rightPanel && rightPanel }
            </div>
            { props.bottomPanel && bottomPanel }
        </div>

    </Box>
}

export default ResizeablePanelLayout
