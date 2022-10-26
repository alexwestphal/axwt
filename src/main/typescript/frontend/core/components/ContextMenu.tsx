
import * as React from 'react'
import {ListItemIcon, ListItemText, Menu, MenuItem, Typography} from '@mui/material'
import {SvgIconProps} from '@mui/material/SvgIcon'
import BlankIcon from '@axwt/core/icons/Blank'
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'


export interface ContextMenuItemSpec {
    label: string
    divider?: boolean
    icon?: React.ComponentType<SvgIconProps>
    onClick?: () => void
    submenuItems?: ContextMenuItemSpec[]
    keyboardShortcut?: string
}

export interface ContextMenuHookReturn {
    contextMenuProps: Omit<ContextMenuProps, 'menuItems'>
    handleContextMenu: (event: React.MouseEvent<HTMLElement>, targetId?: string) => void
}

export const useContextMenuHandler = (): ContextMenuHookReturn => {

    const [position, setPosition] = React.useState<{ left: number, top: number } | null>(null)
    const [menuTargetId, setMenuTargetId] = React.useState<string | null>(null)

    const handleClose = () => {
        setPosition(null)
        setMenuTargetId(null)
    }

    return {
        contextMenuProps: { position, targetId: menuTargetId, onClose: handleClose, },
        handleContextMenu: (event, targetId) => {
            event.preventDefault()
            setPosition(position === null ? { left: event.clientX + 2, top: event.clientY - 6 } : null)
            if(targetId) setMenuTargetId(targetId)
        }
    }
}


export interface ContextMenuProps {
    menuItems: ContextMenuItemSpec[]
    position: { left: number, top: number } | null
    targetId?: string
    onClose: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {

    const [subMenuEl, setSubMenuEl] = React.useState<HTMLElement | null>(null)
    const [subMenuSpec, setSubMenuSpec] = React.useState<ContextMenuItemSpec | null>()

    const handleClose = () => {
        setSubMenuEl(null)
        setSubMenuSpec(null)
        props.onClose()
    }

    return props.position && <>
        <Menu
            open={Boolean(props.position)}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={props.position !== null ? props.position : undefined }
            MenuListProps={{ dense: true }}
        >
            {props.menuItems.map((menuItem, menuItemIndex) => {
                let isSubMenu = menuItem.submenuItems !== undefined

                return <MenuItem
                    key={menuItemIndex}
                    autoFocus={menuItemIndex == 0}
                    divider={menuItem.divider}
                    onClick={(event) => {
                        if(isSubMenu) {
                            setSubMenuEl(event.currentTarget)
                            setSubMenuSpec(menuItem)
                        } else {
                            handleClose()
                            if(menuItem.onClick) menuItem.onClick()
                        }
                    }}
                    onKeyDown={(event) => {
                        if(isSubMenu && event.key == 'ArrowRight') {
                            setSubMenuEl(event.currentTarget)
                            setSubMenuSpec(menuItem)
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
            {subMenuSpec?.submenuItems.map((menuItem, menuItemIndex) => {

                return <MenuItem
                    key={menuItemIndex}
                    autoFocus={menuItemIndex == 0}
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


