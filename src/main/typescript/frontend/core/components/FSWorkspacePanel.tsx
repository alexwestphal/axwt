
import * as React from 'react'

import {
    Box,
    Button,
    Collapse, IconButton,
    List, ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'

import {ContextMenu, FileSystem, useContextMenuHandler} from '@axwt/core'
import * as Core from '@axwt/core/store'

import {createClasses} from '@axwt/util'


export interface FSWorkspacePanelProps {
    workspaceId: string
}

const fsWorkspacePanelClasses = createClasses("FileSystemPanel", [])

export const FSWorkspacePanel: React.FC<FSWorkspacePanelProps> = ({ workspaceId }) => {

    const workspace = Core.useTypedSelector(state => Core.selectFSWorkspace(state, workspaceId))
    const dispatch = Core.useThunkDispatch()

    const [selectedPath, setSelectedPath] = React.useState<string>("/")

    const {contextMenuProps, handleContextMenu} = useContextMenuHandler()


    const classes = fsWorkspacePanelClasses

    if(workspace.status == 'Pending') {
        return <Box display="flex" justifyContent="center" padding={2}>
            <Button variant="contained" onClick={() => dispatch(Core.FSActions.loadWorkspace(workspaceId))}>Load Files</Button>
        </Box>
    } else {
        return <List
            className={classes.root}
            component="div" dense
            onContextMenu={handleContextMenu}
            sx={{}}
        >
            <DirectoryDisplay
                directory={workspace.rootEntry} depth={1}
                folds={workspace.folds}
                toggleFold={(path) => dispatch(Core.FSActions.toggleFold(workspaceId, path))}
                selectedPath={selectedPath}
                onSelect={(path) => setSelectedPath(path)}
            />
            <ContextMenu {...contextMenuProps} menuItems={[
                {
                    label: "New",
                    submenuItems: [
                        { label: "Sudoku Board" },
                        { label: "Directory", icon: FolderIcon },
                    ],
                    divider: true
                },
                {
                    label: "Cut",
                    icon: ContentCutIcon,
                    keyboardShortcut: '⌘X'
                },
                {
                    label: "Copy",
                    icon: ContentCopyIcon,
                    keyboardShortcut: '⌘C'
                },
                {
                    label: "Paste",
                    icon: ContentPasteIcon,
                    keyboardShortcut: '⌘P',
                    divider: true
                },
                {
                    label: "Delete"
                }
            ]}/>
        </List>
    }


}

export default FSWorkspacePanel


export const FSWorkspacePanelControls: React.FC<FSWorkspacePanelProps> = ({ workspaceId }) => {

    const workspace = Core.useTypedSelector(state => Core.selectFSWorkspace(state, workspaceId))
    const dispatch = Core.useThunkDispatch()

    return workspace.status == 'Open' && <>
        <Tooltip title="Expand All">
            <IconButton
                size="small"
                disabled={workspace.overallFold == 'UnfoldAll'}
                onClick={() => dispatch(Core.FSActions.unfoldAll(workspaceId))}
            >
                <UnfoldMoreIcon/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Collapse All">
            <IconButton
                size="small"
                disabled={workspace.overallFold == 'FoldAll'}
                onClick={() => dispatch(Core.FSActions.foldAll(workspaceId))}
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