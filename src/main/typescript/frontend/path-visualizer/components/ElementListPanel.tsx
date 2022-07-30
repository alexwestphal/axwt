/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemProps,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from '@mui/material'
import {blueGrey} from '@mui/material/colors'

import CircleIcon from '@mui/icons-material/CircleOutlined'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import PolylineIcon from '@mui/icons-material/PolylineOutlined'
import RectangleIcon from '@mui/icons-material/RectangleOutlined'

import BlankIcon from '@axwt/core/icons/Blank'

import {cls, createClasses} from '@axwt/util'

import {Element, ElementId, ElementType} from '../data'
import {ElementsActions, selectCurrentElement, selectElements, useThunkDispatch, useTypedSelector} from '../store'
import DeleteIcon from '@mui/icons-material/Delete'


const elementsPanelClasses = createClasses("ElementsPanel", ["listItem", "listItemCurrent", "listItemType", "subtleText"])

export const ElementListPanel: React.FC = () => {

    const [contextMenu, setContextMenu] = React.useState<{mouseX: number, mouseY: number} | null>(null)
    const [contentMenuTarget, setContextMenuTarget] = React.useState<ElementId | null>(null)
    const [newSubMenuEl, setNewSubMenuEl] = React.useState<HTMLElement | null>(null)

    const elements = useTypedSelector(selectElements)
    const currentElement = useTypedSelector(selectCurrentElement)

    const dispatch = useThunkDispatch()

    const handleMenuClose = () => {
        setNewSubMenuEl(null)
        setContextMenu(null)
        setContextMenuTarget(null)
    }

    const handleNewElementClick = (elementType: ElementType) => () => {
        handleMenuClose()
        dispatch(ElementsActions.newElement(elementType))
    }

    const handleContextMenu: React.MouseEventHandler<HTMLElement> = (event) => {

        event.preventDefault()
        setNewSubMenuEl(null)
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6
                }
                : null
        )
    }

    const handleElementContextMenu = (elementId: ElementId): React.MouseEventHandler<HTMLElement> => (event) => {
        event.stopPropagation()
        setContextMenuTarget(elementId)
        handleContextMenu(event)
    }

    const handleListItemClick = (elementId: ElementId) => () => {
        let element = elements.find(el => el.elementId == elementId)
        dispatch(ElementsActions.selectCurrentElement({ elementType: element.elementType, elementId }))
    }

    const handleDelete = () => {
        handleMenuClose()
        dispatch(ElementsActions.deleteElement(contentMenuTarget))
    }

    const classes = elementsPanelClasses

    return <Box
        className={classes.root}
        onContextMenu={handleContextMenu}
        sx={{
            flexGrow: 1,

            [`& .${classes.listItemCurrent}`]: {
                backgroundColor: blueGrey[50],
            },

            [`& .${classes.listItemType}`]: {
                fontWeight: 'bold'
            },

            [`& span.${classes.subtleText}`]: {
                color: blueGrey[300],
            }
        }}
    >
        <List disablePadding>
            {elements.map(element =>
                <ElementListItem
                    key={element.elementId}
                    element={element}
                    isCurrent={element.elementId == currentElement?.elementId}
                    onContextMenu={handleElementContextMenu(element.elementId)}
                    onClick={handleListItemClick(element.elementId)}
                />
            )}
        </List>
        <Menu
            open={contextMenu !== null}
            onClose={handleMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
            MenuListProps={{
                dense: true
            }}
        >
            <MenuItem
                autoFocus
                divider
                onClick={(ev) => setNewSubMenuEl(ev.currentTarget)}
                onKeyDown={(event) => {
                    if(event.key == 'ArrowRight') setNewSubMenuEl(event.currentTarget)
                }}
            >
                <ListItemIcon>
                    <BlankIcon/>
                </ListItemIcon>
                <ListItemText>
                    New
                </ListItemText>
                <ArrowRightIcon/>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <ContentCutIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Cut
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘X
                </Typography>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <ContentCopyIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Copy
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘C
                </Typography>
            </MenuItem>
            <MenuItem divider={!!contentMenuTarget}>
                <ListItemIcon>
                    <ContentPasteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    Paste
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘V
                </Typography>
            </MenuItem>
            {contentMenuTarget && <>
                <MenuItem
                    onClick={handleDelete}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        Delete
                    </ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <BlankIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        Duplicate
                    </ListItemText>
                </MenuItem>
            </>}

        </Menu>
        <Menu
            open={Boolean(contextMenu) && Boolean(newSubMenuEl)}
            anchorEl={newSubMenuEl}
            onClose={handleMenuClose}
            onKeyDown={(event) => {
                if(event.key == 'ArrowLeft') setNewSubMenuEl(null)
            }}
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
            <MenuItem onClick={handleNewElementClick('circle')}>
                <ListItemIcon>
                    <CircleIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>circle</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewElementClick('ellipse')}>
                <ListItemIcon>
                    <BlankIcon/>
                </ListItemIcon>
                <ListItemText>ellipse</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewElementClick('g')}>
                <ListItemIcon>
                    <BlankIcon/>
                </ListItemIcon>
                <ListItemText>g</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewElementClick('line')}>
                <ListItemIcon>
                    <BlankIcon/>
                </ListItemIcon>
                <ListItemText>line</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewElementClick('path')}>
                <ListItemIcon>
                    <BlankIcon/>
                </ListItemIcon>
                <ListItemText>path</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewElementClick('polygon')}>
                <ListItemIcon>
                    <BlankIcon/>
                </ListItemIcon>
                <ListItemText>polygon</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewElementClick('polyline')}>
                <ListItemIcon>
                    <PolylineIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>polyline</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewElementClick('rect')}>
                <ListItemIcon>
                    <RectangleIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>rect</ListItemText>
            </MenuItem>
        </Menu>
    </Box>
}

export default ElementListPanel


export type ElementListItemProps = ListItemProps & {
    element: Element
    isCurrent?: boolean
}


export const ElementListItem: React.FC<ElementListItemProps> = ({element, isCurrent, ...props}) => {

    const classes = elementsPanelClasses

    return <ListItem className={cls(classes.listItem, { [classes.listItemCurrent]: isCurrent })} {...props}>
        <ListItemText>
            <span className={classes.subtleText}>{"<"}</span>
            <span className={classes.listItemType}>{element.elementType}</span>
            {element.htmlId && <>
                <span className={classes.subtleText}>{" id=\""}</span>
                    {element.htmlId}
                <span className={classes.subtleText}>{"\""}</span>
            </>}
            <span className={classes.subtleText}>{">"}</span>
        </ListItemText>
    </ListItem>
}