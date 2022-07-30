/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography} from '@mui/material'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddIcon from '@mui/icons-material/Add'
import SplitIcon from '@mui/icons-material/CallSplitOutlined'
import DeleteIcon from '@mui/icons-material/Delete'

import {cls} from '@axwt/util'

import {Element} from '../../data'
import { PathSegmentsActions,  useThunkDispatch} from '../../store'

import {elementAttributesClasses, ElementAttributesComponent} from './ElementAttributes'
import EditPathSegment from '../EditPathSegment'


export const PathSpecificAttributes: ElementAttributesComponent<Element.Path> = ({element}) => {

    const [contextMenu, setContextMenu] = React.useState<{mouseX: number, mouseY: number} | null>(null)

    const dispatch = useThunkDispatch()

    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (ev) => {
        ev.preventDefault()
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: ev.clientX + 2,
                    mouseY: ev.clientY - 6
                }
                : null
        )
    }

    const handleNewSegment = () => {
        setContextMenu(null)
        dispatch(PathSegmentsActions.newSegment(element.elementId))
    }

    const classes = elementAttributesClasses

    return <Box
        className={cls(classes.root, classes.path)}
        onContextMenu={handleContextMenu}
    >
        <Typography variant="h6" className={classes.title}>Path Segments</Typography>

        <div className={classes.segmentList}>
            {element.segmentIds.map((segmentId, index) =>
                <EditPathSegment
                    key={segmentId}
                    pathId={element.elementId}
                    segmentId={segmentId}
                    first={index==0}
                />
            )}
        </div>
        <Menu

            open={contextMenu !== null}
            onClose={() => setContextMenu(null)}
            anchorReference="anchorPosition"
            anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        >
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
            <MenuItem>
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
            <Divider/>
            <MenuItem onClick={handleNewSegment}>
                <ListItemIcon>
                    <AddIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>
                    New Segment
                </ListItemText>
                <Typography variant="body2" color="text.secondary" pl={1}>
                    ⌘N
                </Typography>
            </MenuItem>
        </Menu>
    </Box>
}

export default PathSpecificAttributes