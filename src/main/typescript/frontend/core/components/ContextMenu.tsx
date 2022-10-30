
import * as React from 'react'
import {
    ClickAwayListener,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList, Paper,
    Popper,
    Typography
} from '@mui/material'
import {SvgIconProps} from '@mui/material/SvgIcon'
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import {KeyboardShortcut, UUID} from '@axwt/core'
import BlankIcon from '@axwt/core/icons/Blank'


export interface ContextMenuItemSpec {
    id?: UUID
    label: string
    divider?: boolean
    icon?: React.ComponentType<SvgIconProps>
    onClick?: (targetType?: string, targetId?: UUID) => void
    submenuItems?: ContextMenuItemSpec[]
    keyboardShortcut?: KeyboardShortcut
    availableFor?: string | string[]
}

export interface ContextMenuHookReturn {
    contextMenuProps: Omit<ContextMenuProps, 'menuItems'>
    handleContextMenu: ContextMenuHandler
}

export type ContextMenuHandler = (event: React.MouseEvent<HTMLElement>, targetType?: string, targetId?: UUID) => void

export const useContextMenuHandler = (): ContextMenuHookReturn => {

    const [position, setPosition] = React.useState<{ left: number, top: number } | null>(null)
    const [menuTargetType, setMenuTargetType] = React.useState<string | null>(null)
    const [menuTargetId, setMenuTargetId] = React.useState<UUID | null>(null)

    const handleClose = () => {
        setPosition(null)
        setMenuTargetId(null)
    }

    return {
        contextMenuProps: { position, targetType: menuTargetType, targetId: menuTargetId, onClose: handleClose, },
        handleContextMenu: (event, targetType = null, targetId = null) => {
            event.preventDefault()
            setPosition(position === null ? { left: event.clientX + 2, top: event.clientY } : null)
            setMenuTargetType(targetType)
            setMenuTargetId(targetId)
        }
    }
}


export interface ContextMenuProps {
    menuItems: ContextMenuItemSpec[]
    position: { left: number, top: number } | null
    targetType: string | null
    targetId: string | null
    onClose: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {

    const menuItems = React.useMemo(() => props.menuItems.map(menuItem => ({
        ...menuItem,
        id: menuItem.id ?? UUID.create(),
        submenuItems: menuItem.submenuItems?.map(submenuItem => ({
            ...submenuItem,
            id: submenuItem.id ?? UUID.create(),
            submenuItems: undefined
        }))

    })), [props.menuItems])

    const [openSubmenu, setOpenSubmenu] = React.useState<{ id: UUID, anchorEl: HTMLElement } | null>(null)

    const isOpen = props.position != null

    const handleMenuItemClick = (menuItem: ContextMenuItemSpec) => (event: React.MouseEvent<HTMLElement>) => {
        handleClose()
        if(menuItem.onClick) menuItem.onClick(props.targetType, props.targetId)
    }

    const handleMenuItemHover = (menuItem: ContextMenuItemSpec) => (event: React.MouseEvent<HTMLElement>) => {
        if(openSubmenu) {
            if(openSubmenu.id == menuItem.id) {
                // Submenu is already open, do nothing
            } else if(menuItem.submenuItems != null) {
                // Different submenu is open, open this one instead
                setOpenSubmenu({ id: menuItem.id, anchorEl: event.currentTarget })
            } else {
                // Different submenu is open and not one here, close it
                setOpenSubmenu(null)
            }
        } else if(menuItem.submenuItems != null) {
            // Submenu not yet open, so open it
            setOpenSubmenu({ id: menuItem.id, anchorEl: event.currentTarget })
        }
    }

    const handleSubmenuClick = (menuItem: ContextMenuItemSpec) => (event: React.MouseEvent<HTMLElement>) => {
        setOpenSubmenu({ id: menuItem.id, anchorEl: event.currentTarget })
    }

    const handleClose = () => {
        setOpenSubmenu(null)
        props.onClose()
    }

    const filterMenuItems = (menuItems: ContextMenuItemSpec[]) => menuItems.filter(menuItem => {
        if(menuItem.availableFor === undefined) return true
        if(typeof menuItem.availableFor === 'string') return menuItem.availableFor == props.targetType
        else if(Array.isArray(menuItem.availableFor)) return menuItem.availableFor.includes(props.targetType)
        else return false
    })

    return <ClickAwayListener onClickAway={handleClose}>
        <Popper
            anchorEl={props.position && { getBoundingClientRect: () => new DOMRect(props.position.left, props.position.top) }}
            open={isOpen}
            placement="right-start"
            role={undefined}
        >
            <Paper square sx={{ width: 200 }}>
                <MenuList
                    dense disablePadding
                    variant="menu"
                    autoFocusItem={isOpen}
                >
                    {filterMenuItems(menuItems).map(menuItem => {
                        if(menuItem.submenuItems != null) {
                            // Submenu
                            let isSubmenuOpen = openSubmenu ? openSubmenu.id == menuItem.id : false

                            return <MenuItem
                                key={menuItem.id}
                                id={menuItem.id}
                                divider={menuItem.divider}
                                onClick={handleSubmenuClick(menuItem)}
                                onMouseEnter={handleMenuItemHover(menuItem)}
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
                                >
                                    <Paper square sx={{ width: 200 }}>
                                        <MenuList
                                            dense disablePadding
                                            variant="menu"
                                            autoFocusItem={openSubmenu?.id == menuItem.id}
                                        >
                                            {filterMenuItems(menuItem.submenuItems).map(submenuItem =>
                                                <MenuItem
                                                    key={submenuItem.id}
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
                                            )}
                                        </MenuList>
                                    </Paper>
                                </Popper>
                            </MenuItem>

                        } else {
                            // Normal Item

                            return <MenuItem
                                key={menuItem.id}
                                id={menuItem.id}
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
    </ClickAwayListener>
}