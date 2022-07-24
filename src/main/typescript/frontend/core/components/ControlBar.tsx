
import * as React from 'react'
import {Redirect} from 'react-router-dom'

import {AppBar, Box, Hidden, IconButton, Toolbar, Tooltip, Typography} from '@mui/material'

import {cls, createClasses} from '@axwt/util'

import * as Core from '../store'



export interface ControlBarProps {

    /**
     * Navigation Controls
     */
    navControls?: React.ReactNode

    /**
     * Show the left drawer control
     * @default false
     */
    leftDrawerControl?: DrawerControl

    /**
     * Show the right drawer control
     * @default false
     */
    rightDrawerControl?: DrawerControl
}

export const ControlBarContext = React.createContext<[ControlBarProps, (props: ControlBarProps) => void]>([{}, () => {}])

export const controlBarClasses = createClasses("ControlBar", ["drawerButton", "drawerButton_closed", "drawerButton_open", "title", "titleOuter"])

/**
 * Component to actually mount the control bar
 */
export const ControlBarBase: React.FC = () => {
    const [props] = React.useContext(ControlBarContext)

    const [redirect, setRedirect] = React.useState<string>(null)

    const display = Core.useTypedSelector(Core.selectDisplay)

    const dispatch = Core.useThunkDispatch()

    const handleToggleLeftDrawerOpen = () => dispatch(Core.DisplayActions.toggleDrawer('Left'))
    const handleToggleRightDrawerOpen = () => dispatch(Core.DisplayActions.toggleDrawer('Right'))

    const classes = controlBarClasses

    let leftTooltipText = "", rightTooltipText = ""
    if(props.leftDrawerControl?.tooltip) {
        let tooltipConfig = props.leftDrawerControl.tooltip
        if(typeof tooltipConfig === 'string') leftTooltipText = tooltipConfig
        else if(display.leftDrawer == 'Open') leftTooltipText = tooltipConfig.open
        else leftTooltipText = tooltipConfig.closed
    }
    if(props.rightDrawerControl?.tooltip) {
        let tooltipConfig = props.rightDrawerControl.tooltip
        if(typeof tooltipConfig === 'string') rightTooltipText = tooltipConfig
        else if(display.leftDrawer == 'Open') rightTooltipText = tooltipConfig.open
        else rightTooltipText = tooltipConfig.closed
    }

    let leftDrawerControl = props.leftDrawerControl && <IconButton
        className={cls(classes.drawerButton, { [classes.drawerButton_open]: display.leftDrawer == 'Open' })}
        size="large"
        aria-label={leftTooltipText}
        disabled={display.leftDrawer == 'Locked'}
        onClick={handleToggleLeftDrawerOpen}
        children={props.leftDrawerControl.icon}
    />
    if(props.leftDrawerControl?.tooltip) {
        leftDrawerControl = <Tooltip title={leftTooltipText}><span>{leftDrawerControl}</span></Tooltip>
    }

    let rightDrawerControl = props.rightDrawerControl && <IconButton
        className={cls(classes.drawerButton, { [classes.drawerButton_open]: display.rightDrawer == 'Open' })}
        size="large"
        aria-label={rightTooltipText}
        disabled={display.rightDrawer == 'Locked'}
        onClick={handleToggleRightDrawerOpen}
        children={props.rightDrawerControl.icon}
    />
    if(props.rightDrawerControl?.tooltip) {
        rightDrawerControl = <Tooltip title={rightTooltipText}><span>{rightDrawerControl}</span></Tooltip>
    }

    return <AppBar
        className={classes.root}
        position="fixed"
        sx={ (theme) => ({
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.banner.backgroundColor,
            color: theme.banner.textColor,

            [`& .${classes.drawerButton}`]: {
                color: 'inherit',
            },
            [`& .${classes.drawerButton_open}`]: {
                backgroundColor: "rgba(0, 0, 0, 0.05)"
            },
            [`& .${classes.title}`]: {
                fontSize: '1.125rem',
                paddingX: 2,
                paddingY: 1,
            },
            [`& .${classes.titleOuter}`]: {
                flexGrow: 1,
            },
        })}>
        <Toolbar variant="dense" disableGutters>
            {leftDrawerControl }
            <div className={classes.titleOuter} >
                <Typography className={classes.title} variant="h6" component="h1" noWrap onClick={() => setRedirect("/")}>
                    AXWT { display.title && <Hidden mdDown>| {display.title}</Hidden>}
                </Typography>
            </div>
            <Box display="flex">{props.navControls}</Box>
            { rightDrawerControl || <Box mr={1}/>}
        </Toolbar>
        {redirect && <Redirect push to={redirect}/>}
    </AppBar>
}


export interface DrawerControl {
    icon: React.ReactNode
    tooltip?: string | { open: string, closed: string }
}




export const ControlBar: React.FC<ControlBarProps> = (props) => {
    const [currentProps, setProps] = React.useContext(ControlBarContext)
    React.useEffect(() => {
        setProps(props)
        return () => { setProps({}) }
    }, [props])

    return <></>
}