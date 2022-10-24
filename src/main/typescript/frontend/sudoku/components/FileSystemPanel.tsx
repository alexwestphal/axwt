
import * as React from 'react'

import {
    Box,
    Button,
    Collapse, IconButton,
    List, ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem, Tooltip
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'

import {FileSystem} from '@axwt/core'
import BlankIcon from '@axwt/core/icons/Blank'

import {createClasses} from '@axwt/util'

import {FileSystemActions, selectFSState, useThunkDispatch, useTypedSelector} from '../store'

const fileSystemPanelClasses = createClasses("FileSystemPanel", [])

export const FileSystemPanel: React.FC = () => {

    const fsState = useTypedSelector(selectFSState)
    const dispatch = useThunkDispatch()

    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number, mouseY: number } | null>(null)
    const [selectedPath, setSelectedPath] = React.useState<string>("/")

    const handleMenuClose = () => {
        setContextMenu(null)
    }

    const handleContextMenu: React.MouseEventHandler = (event) => {
        event.preventDefault()
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : null
        )
    }

    const classes = fileSystemPanelClasses

    if(fsState.status == 'Pending') {
        return <Box display="flex" justifyContent="center" padding={2}>
            <Button variant="contained" onClick={() => dispatch(FileSystemActions.load())}>Load Files</Button>
        </Box>
    } else {
        return <List
            className={classes.root}
            component="div" dense
            onContextMenu={handleContextMenu}
            sx={{}}
        >
            <DirectoryDisplay
                directory={fsState.rootEntry} depth={1}
                folds={fsState.folds}
                toggleFold={(path) => dispatch(FileSystemActions.toggleFold(path))}
                selectedPath={selectedPath}
                onSelect={(path) => setSelectedPath(path)}
            />
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
                >
                    <ListItemIcon>
                        <BlankIcon/>
                        <ListItemText primary="New Board"/>
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </List>
    }


}

export default FileSystemPanel

export const FileSystemPanelControls: React.FC = () => {

    const fsState = useTypedSelector(selectFSState)
    const dispatch = useThunkDispatch()

    return fsState.status == 'Open' && <>
        <Tooltip title="Expand All">
            <IconButton
                size="small"
                disabled={fsState.overallFold == 'UnfoldAll'}
                onClick={() => dispatch(FileSystemActions.unfoldAll())}
            >
                <UnfoldMoreIcon/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Collapse All">
            <IconButton
                size="small"
                disabled={fsState.overallFold == 'FoldAll'}
                onClick={() => dispatch(FileSystemActions.foldAll())}
            >
                <UnfoldLessIcon/>
            </IconButton>
        </Tooltip>
    </>
}


export interface DirectoryDisplayProps {
    directory: FileSystem.Directory
    depth: number
    folds: Record<string, 'Fold' | 'Unfold'>
    toggleFold: (path: string) => void
    selectedPath: string
    onSelect: (path: string) => void
}

export const DirectoryDisplay: React.FC<DirectoryDisplayProps> = ({directory, depth, folds, toggleFold, selectedPath, onSelect}) => {

    let open = folds[directory.path] == 'Unfold'

    const handleToggleFold = () => toggleFold(directory.path)

    return <>
        <ListItem
            secondaryAction={open
                ? <Tooltip title="Collapse Directory">
                    <IconButton edge="end" onClick={handleToggleFold}>
                        <ExpandLessIcon />
                    </IconButton>
                </Tooltip>
                : <Tooltip title="Expand Directory">
                    <IconButton edge="end" onClick={handleToggleFold}>
                        <ExpandMoreIcon />
                    </IconButton>
                </Tooltip>
            }
            dense
            disablePadding
        >
            <ListItemButton
                dense
                selected={selectedPath == directory.path}
                onClick={() => onSelect(directory.path)}
                onDoubleClick={handleToggleFold}
                sx={{ pl: depth*2 }}
            >
                <ListItemIcon>
                    <FolderIcon/>
                </ListItemIcon>
                <ListItemText primary={directory.name}/>
            </ListItemButton>

        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" dense disablePadding>
                {directory.entries.map((entry, entryIndex) =>
                    FileSystem.isDirectory(entry)
                        ? <DirectoryDisplay
                            key={entryIndex}
                            directory={entry}
                            depth={depth+1}
                            folds={folds}
                            toggleFold={toggleFold}
                            selectedPath={selectedPath}
                            onSelect={onSelect}
                        />
                        : <ListItemButton
                            key={entryIndex} dense
                            selected={selectedPath == entry.path}
                            onClick={() => onSelect(entry.path)}
                            sx={{ pl: (depth+1)*2 }}
                        >
                            <ListItemText primary={entry.name}/>
                        </ListItemButton>
                )}
            </List>
        </Collapse>
    </>
}