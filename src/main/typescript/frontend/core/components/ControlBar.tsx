
import * as React from 'react'
import {Link as RouterLink} from 'react-router-dom'

import {
    AppBar,
    Box,
    Button,
    buttonClasses,
    ClickAwayListener,
    IconButton,
    Link, ListItemIcon, ListItemText,
    MenuItem, MenuList, Paper, Popper,
    Toolbar,
    Tooltip, Typography
} from '@mui/material'
import {SvgIconProps} from '@mui/material/SvgIcon'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import {cls, createClasses} from '@axwt/util'

import * as Core from '../store'

import BlankIcon from '@axwt/core/icons/Blank'
import {KeyboardShortcut} from '@axwt/core'




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

    menus?: MenuSpec[]

    onMenuAction?: (actionId: string) => void
}

export const ControlBarContext = React.createContext<[ControlBarProps, (props: ControlBarProps) => void]>([{}, () => {}])

export const controlBarClasses = createClasses("ControlBar", ["drawerButton", "drawerButton_closed", "drawerButton_open", "logo", "main", "menus", "title"])

/**
 * Component to actually mount the control bar
 */
export const ControlBarBase: React.FC = () => {
    const [props] = React.useContext(ControlBarContext)

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
            [`& .${classes.logo}`]: {
                fontSize: '2rem',
                fontWeight: 'normal',
                letterSpacing: '-0.1px',
                paddingLeft: 2,
                paddingRight: 1,
                paddingY: 1,
                color: 'inherit',
                textDecoration: 'none',
            },
            [`& .${classes.main}`]: {
                flexGrow: 1,
            },
            [`& .${classes.menus}`]: {
                display: 'flex',

                [`& .${buttonClasses.root}`]: {
                    color: 'inherit',
                    minWidth: 0,
                    paddingX: 1,
                    paddingY: 0,
                    textTransform: 'none',
                },
            },
            [`& .${classes.title}`]: {
                fontSize: '1.125rem',
                fontWeight: 'bold',
                paddingX: 1
            },

        })}>
        <Toolbar variant="dense" disableGutters>
            {leftDrawerControl }
            <Link className={classes.logo} component={RouterLink} to="/">
                AXWT
            </Link>
            <div className={classes.main}>
                <div className={classes.title}>{display.title || "..."}</div>
                <ControlBarMenus menus={props.menus} onMenuAction={props.onMenuAction}/>
            </div>
            <Box display="flex">{props.navControls}</Box>
            { rightDrawerControl || <Box mr={1}/>}
        </Toolbar>

    </AppBar>
}


export interface DrawerControl {
    icon: React.ReactNode
    tooltip?: string | { open: string, closed: string }
}

export interface MenuSpec {
    label: string
    id: string
    menuItems: (MenuItemSpec | SubmenuSpec)[]
}

export interface SubmenuSpec {
    label: string
    id: string
    divider?: boolean
    icon?: React.ComponentType<SvgIconProps>
    submenuItems: MenuItemSpec[]
}

const isSubMenuSpec = (menuItem: MenuItemSpec | SubmenuSpec): menuItem is SubmenuSpec =>
    (menuItem as SubmenuSpec).submenuItems !== undefined

export interface MenuItemSpec {
    label: string
    actionId: string

    divider?: boolean
    icon?: React.ComponentType<SvgIconProps>
    keyboardShortcut?: KeyboardShortcut

}


export const ControlBar: React.FC<ControlBarProps> = (props) => {
    const [currentProps, setProps] = React.useContext(ControlBarContext)
    React.useEffect(() => {

        setProps(props)
        return () => { setProps({}) }
    }, [props])

    return <></>
}


type OpenMenu = { id: string, anchorEl: HTMLElement }

interface ControlBarMenusProps {
    menus?: MenuSpec[]
    onMenuAction?: (actionId: string) => void
}

const ControlBarMenus: React.FC<ControlBarMenusProps> = ({menus = [], onMenuAction}) => {
    const [openMenu, setOpenMenu] = React.useState<OpenMenu | null>(null)
    const [openSubmenu, setOpenSubmenu] = React.useState<OpenMenu | null>(null)

    const handleMenuClick = (menuSpec: MenuSpec) => (event: React.MouseEvent<HTMLElement>) => {
        if(openMenu) {
            // Already open, so close it
            handleClose()
        } else {
            setOpenMenu({ id: menuSpec.id, anchorEl: event.currentTarget })
        }
    }

    const handleMenuHover = (menuSpec: MenuSpec) => (event: React.MouseEvent<HTMLElement>) => {
        if(openMenu && openMenu.id != menuSpec.id) {
            setOpenMenu({ id: menuSpec.id, anchorEl: event.currentTarget })
        }
    }

    const handleMenuItemClick = (menuItemSpec: MenuItemSpec) => (event: React.MouseEvent<HTMLElement>) => {
        handleClose()
        if(onMenuAction) onMenuAction(menuItemSpec.actionId)
    }

    const handleMenuItemHover = (menuItemSpec: MenuItemSpec) => (event: React.MouseEvent<HTMLElement>) => {
        if(openSubmenu) {
            if(openSubmenu.id == menuItemSpec.actionId) {
                // Submenu is already open, do nothing
            } else if(isSubMenuSpec(menuItemSpec)) {
                // Different submenu is open, open this one instead
                setOpenSubmenu({ id: menuItemSpec.actionId, anchorEl: event.currentTarget })
            } else {
                // Different submenu is open and not one here, close it
                setOpenSubmenu(null)
            }
        }
    }

    const handleSubmenuClick = (submenuSpec: SubmenuSpec) => (event: React.MouseEvent<HTMLElement>) => {
        setOpenSubmenu({ id: submenuSpec.id, anchorEl: event.currentTarget })
    }
    const handleSubmenuHover = (submenuSpec: SubmenuSpec) => (event: React.MouseEvent<HTMLElement>) => {
        if(!openSubmenu || openSubmenu?.id != submenuSpec.id) {
            // Open sub menu if not already open
            setOpenSubmenu({ id: submenuSpec.id, anchorEl: event.currentTarget })
        }

    }

    const handleListKeyDown = (event: React.KeyboardEvent) => {

    }

    const handleClose = () => {
        setOpenMenu(null)
        setOpenSubmenu(null)
    }

    const classes = controlBarClasses
    return <ClickAwayListener onClickAway={handleClose}>
        <div className={classes.menus}>
            {menus.map((menuSpec, menuIndex) => {
                let labelId = `${menuSpec.id}-label`
                let isOpen = openMenu ? openMenu.id == menuSpec.id : false

                return <React.Fragment key={menuIndex}>
                    <Button
                        id={labelId}
                        aria-controls={isOpen ? menuSpec.id : undefined}
                        aria-haspopup="true"
                        aria-expanded={isOpen ? 'true' : undefined}
                        size="small"
                        onClick={handleMenuClick(menuSpec)}
                        onMouseEnter={handleMenuHover(menuSpec)}
                    >
                        {menuSpec.label}
                    </Button>
                    <Popper
                        anchorEl={openMenu?.anchorEl}
                        open={isOpen}
                        placement="bottom-start"
                        role={undefined}
                        disablePortal
                    >
                        <Paper square sx={{ width: 240 }}>
                            <MenuList
                                id={menuSpec.id}
                                dense
                                autoFocusItem={isOpen}
                                aria-labelledby={labelId}
                                onKeyDown={handleListKeyDown}
                            >
                                {menuSpec.menuItems.map((menuItem, menuItemIndex) => {
                                    if(isSubMenuSpec(menuItem)) {
                                        // Submenu
                                        let subMenuId = `${menuSpec.id}-${menuItem.id}`
                                        let subMenuLabelId = `${subMenuId}-label`
                                        let isSubmenuOpen = openSubmenu ? openSubmenu.id == menuItem.id : false

                                        return <MenuItem
                                            key={subMenuId}
                                            id={subMenuId}
                                            divider={menuItem.divider}
                                            onClick={handleSubmenuClick(menuItem)}
                                            onMouseEnter={handleSubmenuHover(menuItem)}
                                        >
                                            <ListItemIcon>
                                                {React.createElement(menuItem.icon ?? BlankIcon, { fontSize: 'small' })}
                                            </ListItemIcon>
                                            <ListItemText>
                                                {menuItem.label}
                                            </ListItemText>
                                            <Typography variant="body2" color="text.secondary">
                                                <ArrowRightIcon fontSize="small"/>
                                            </Typography>
                                            <Popper
                                                anchorEl={openSubmenu?.anchorEl}
                                                open={isSubmenuOpen}
                                                placement="right-start"
                                                role={undefined}
                                                disablePortal
                                            >
                                                <Paper sx={{ width: 200 }}>
                                                    <MenuList
                                                        id={subMenuId}
                                                        dense
                                                        autoFocusItem={isSubmenuOpen}
                                                        aria-labelledby={subMenuLabelId}
                                                        onKeyDown={handleListKeyDown}
                                                    >
                                                        {menuItem.submenuItems.map((submenuItem, submenuItemIndex) => {

                                                            return <MenuItem
                                                                key={submenuItemIndex}
                                                                divider={submenuItem.divider}
                                                                onClick={handleMenuItemClick(submenuItem)}
                                                            >
                                                                <ListItemIcon>
                                                                    {React.createElement(submenuItem.icon ?? BlankIcon, { fontSize: 'small' })}
                                                                </ListItemIcon>
                                                                <ListItemText>
                                                                    {submenuItem.label}
                                                                </ListItemText>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {KeyboardShortcut.shortcutString(submenuItem.keyboardShortcut)}
                                                                </Typography>
                                                            </MenuItem>
                                                        })}
                                                    </MenuList>
                                                </Paper>
                                            </Popper>
                                        </MenuItem>
                                    } else {
                                        let itemId = `${menuSpec.id}-${menuItem.actionId}`

                                        // Normal item
                                        return <MenuItem
                                            key={itemId}
                                            id={itemId}
                                            divider={menuItem.divider}
                                            onClick={handleMenuItemClick(menuItem)}
                                            onMouseEnter={handleMenuItemHover(menuItem)}
                                        >
                                            <ListItemIcon>
                                                {React.createElement(menuItem.icon ?? BlankIcon, { fontSize: 'small' })}
                                            </ListItemIcon>
                                            <ListItemText>
                                                {menuItem.label}
                                            </ListItemText>
                                            <Typography variant="body2" color="text.secondary">
                                                {KeyboardShortcut.shortcutString(menuItem.keyboardShortcut)}
                                            </Typography>
                                        </MenuItem>
                                    }
                                })}
                            </MenuList>
                        </Paper>
                    </Popper>
                </React.Fragment>
            })}
        </div>
    </ClickAwayListener>
}