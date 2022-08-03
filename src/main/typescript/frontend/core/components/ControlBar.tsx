
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
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import {UUID} from '@axwt/core'
import {cls, createClasses} from '@axwt/util'

import * as Core from '../store'
import {SvgIconProps} from '@mui/material/SvgIcon'
import BlankIcon from '@axwt/core/icons/Blank'




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
                <ControlBarMenus menus={props.menus}/>
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
    menuItems: MenuItemSpec[]
}

export interface MenuItemSpec {
    label: string
    id?: string
    onClick: React.MouseEventHandler<HTMLElement>

    divider?: boolean
    icon?: React.ComponentType<SvgIconProps>
    keyboardShortcut?: string

    submenuItems?: MenuItemSpec[]
}


export const ControlBar: React.FC<ControlBarProps> = (props) => {
    const [currentProps, setProps] = React.useContext(ControlBarContext)
    React.useEffect(() => {
        // Add IDs to and menus/items that dont have them already
        let patchedMenus = props.menus.map(menu => ({
            ...menu,
            id: menu.id ?? UUID.create(),
            menuItems: menu.menuItems.map(menuItem => ({
                ...menuItem,
                id: menuItem.id ?? UUID.create(),
                submenuItems: menuItem.submenuItems?.map(submenuItem => ({
                    ...submenuItem,
                    id: submenuItem.id ?? UUID.create()
                }))
            }))
        }))

        setProps({ ...props, menus: patchedMenus })
        return () => { setProps({}) }
    }, [props])

    return <></>
}


type OpenMenu = { id: string, anchorEl: HTMLElement }

interface ControlBarMenusProps {
    menus?: MenuSpec[]
}

const ControlBarMenus: React.FC<ControlBarMenusProps> = ({menus = []}) => {
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
        if(menuItemSpec.submenuItems) {
            // Has a submenu
            setOpenSubmenu({ id: menuItemSpec.id, anchorEl: event.currentTarget })
        } else {
            // Normal menu item
            handleClose()
            menuItemSpec.onClick(event)
        }

    }

    const handleMenuItemHover = (menuItemSpec: MenuItemSpec) => (event: React.MouseEvent<HTMLElement>) => {
        if(openSubmenu) {
            if(openSubmenu.id == menuItemSpec.id) {
                // Submenu is already open, do nothing
            } else if(menuItemSpec.submenuItems) {
                // Different submenu is open, open this one instead
                setOpenSubmenu({ id: menuItemSpec.id, anchorEl: event.currentTarget })
            } else {
                // Different submenu is open and not one here, close it
                setOpenSubmenu(null)
            }
        } else if(menuItemSpec.submenuItems) {
            // have a submenu, so open it
            setOpenSubmenu({ id: menuItemSpec.id, anchorEl: event.currentTarget })
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
                                    let subMenuLabelId = `${menuItem.id}-label`
                                    let isSubmenuOpen = openSubmenu ? openSubmenu.id == menuItem.id : false

                                    return <MenuItem
                                        key={menuItemIndex}
                                        id={subMenuLabelId}
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
                                            {menuItem.submenuItems
                                                ? <ArrowRightIcon fontSize="small"/>
                                                : menuItem.keyboardShortcut ?? ""
                                            }
                                        </Typography>
                                        { menuItem.submenuItems && <Popper
                                            anchorEl={openSubmenu?.anchorEl}
                                            open={isSubmenuOpen}
                                            placement="right-start"
                                            role={undefined}
                                            disablePortal
                                        >
                                            <Paper sx={{ width: 200 }}>
                                                <MenuList
                                                    id={menuItem.id}
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
                                                                {submenuItem.keyboardShortcut ?? ""}
                                                            </Typography>
                                                        </MenuItem>
                                                    })}
                                                </MenuList>
                                            </Paper>
                                        </Popper>}
                                    </MenuItem>
                                })}
                            </MenuList>
                        </Paper>
                    </Popper>
                </React.Fragment>
            })}
        </div>
    </ClickAwayListener>
}