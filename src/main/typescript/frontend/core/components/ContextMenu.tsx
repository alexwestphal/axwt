
import * as React from 'react'
import {ListItemIcon, ListItemText, Menu, MenuItem, Typography} from '@mui/material'
import {SvgIconProps} from '@mui/material/SvgIcon'
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import {UUID} from '@axwt/core'
import BlankIcon from '@axwt/core/icons/Blank'


export interface ContextMenuItemSpec {
    label: string
    divider?: boolean
    icon?: React.ComponentType<SvgIconProps>
    onClick?: (targetType?: string, targetId?: UUID) => void
    submenuItems?: ContextMenuItemSpec[]
    keyboardShortcut?: string
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
            setPosition(position === null ? { left: event.clientX + 2, top: event.clientY - 6 } : null)
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

    const [subMenuEl, setSubMenuEl] = React.useState<HTMLElement | null>(null)
    const [subMenuSpec, setSubMenuSpec] = React.useState<ContextMenuItemSpec | null>()

    const [selectedMenuItem, setSelectedMenuItem] = React.useState<number>(0)

    React.useEffect(() => {
        // Anytime the props change, reset the sub menu
        setSubMenuEl(null)
        setSubMenuSpec(null)
    }, [props])

    const handleClose = () => {
        setSubMenuEl(null)
        setSubMenuSpec(null)
        props.onClose()
    }

    const filterMenuItems = (menuItems: ContextMenuItemSpec[]) => menuItems.filter(menuItem => {
        if(menuItem.availableFor === undefined) return true
        if(typeof menuItem.availableFor === 'string') return menuItem.availableFor == props.targetType
        else if(Array.isArray(menuItem.availableFor)) return menuItem.availableFor.includes(props.targetType)
        else return false
    })

    return props.position && <>
        <Menu
            autoFocus
            open={Boolean(props.position)}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={props.position !== null ? props.position : undefined }
            MenuListProps={{ dense: true }}
        >
            {filterMenuItems(props.menuItems).map((menuItem, menuItemIndex) => {
                let isSubMenu = menuItem.submenuItems !== undefined

                return <MenuItem
                    key={menuItemIndex}
                    divider={menuItem.divider}
                    onClick={(event) => {
                        if(isSubMenu) {
                            setSubMenuEl(event.currentTarget)
                            setSubMenuSpec(menuItem)
                        } else {
                            handleClose()
                            if(menuItem.onClick) menuItem.onClick(props.targetType, props.targetId)
                        }
                    }}
                    onKeyDown={(event) => {
                        if(isSubMenu && event.key == 'ArrowRight') {
                            setSubMenuEl(event.currentTarget)
                            setSubMenuSpec(menuItem)
                        }
                    }}
                    onMouseEnter={(event) => {
                        console.log(`MenuItem onMouseEnter (isSubMenu=${isSubMenu})`)
                        if(isSubMenu) {
                            setSubMenuEl(event.currentTarget)
                            setSubMenuSpec(menuItem)
                        } else {
                            setSubMenuEl(null)
                            setSubMenuSpec(null)
                        }
                    }}
                    sx={{
                        paddingRight: isSubMenu ? 1 : 2
                    }}
                >
                    <ListItemIcon>
                        {React.createElement(menuItem.icon ?? BlankIcon, {fontSize: 'small'})}
                    </ListItemIcon>
                    <ListItemText>{menuItem.label}</ListItemText>
                    { isSubMenu && <ArrowRightIcon/> }
                    { menuItem.keyboardShortcut && <Typography variant="body2" color="text.secondary" pl={2}>
                        {menuItem.keyboardShortcut}
                    </Typography>}
                </MenuItem>
            })}
        </Menu>
        <Menu
            open={Boolean(props.position) && Boolean(subMenuEl)}
            onClose={handleClose}
            onKeyDown={(event) => {
                if(event.key == 'ArrowLeft') {
                    setSubMenuEl(null)
                    setSubMenuSpec(null)
                }
            }}
            anchorEl={subMenuEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
            MenuListProps={{
                dense: true
            }}
        >
            {subMenuSpec && filterMenuItems(subMenuSpec.submenuItems).map((menuItem, menuItemIndex) => {

                return <MenuItem
                    key={menuItemIndex}
                    divider={menuItem.divider}
                    onClick={() => {
                        handleClose()
                        if(menuItem.onClick) menuItem.onClick()
                    }}
                >
                    <ListItemIcon>
                        {React.createElement(menuItem.icon ?? BlankIcon, {fontSize: 'small'})}
                    </ListItemIcon>
                    <ListItemText>{menuItem.label}</ListItemText>
                </MenuItem>
            })}
        </Menu>
    </>
}


