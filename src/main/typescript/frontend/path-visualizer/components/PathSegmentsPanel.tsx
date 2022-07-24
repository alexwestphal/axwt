/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {Box, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography} from '@mui/material'

import {createClasses} from '@axwt/util'

import {Element} from '../data'
import { PathSegmentsActions, selectCurrentElement, useThunkDispatch, useTypedSelector} from '../store'

import EditPathSegment from './EditPathSegment'
import HtmlIdField from '@axwt/path-visualizer/components/HtmlIdField'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddIcon from '@mui/icons-material/Add'
import SplitIcon from '@mui/icons-material/CallSplitOutlined'
import DeleteIcon from '@mui/icons-material/Delete'



const pathSegmentsPanelClasses = createClasses("PathSegmentsPanel", ["segmentList"])

export const PathSegmentsPanel: React.FC = () => {

    const [contextMenu, setContextMenu] = React.useState<{mouseX: number, mouseY: number} | null>(null)

    const path = useTypedSelector(selectCurrentElement) as Element.Path

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
        dispatch(PathSegmentsActions.newSegment(path.elementId))
    }

    const classes = pathSegmentsPanelClasses

    return <Box
        className={classes.root}
        onContextMenu={handleContextMenu}
        sx={{
            flexGrow: 1,

            [`& .${classes.segmentList}`]: {
                flex: '1 0 0',
                marginBottom: 1
            }
        }}
    >

        <HtmlIdField element={path}/>

        <div className={classes.segmentList}>
            {path.segmentIds.map((segmentId, index) =>
                <EditPathSegment
                    key={segmentId}
                    pathId={path.elementId}
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

export default PathSegmentsPanel