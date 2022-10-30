
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
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'

import {createClasses} from '@axwt/util'

import {FileSystem, StandardShortcuts} from '../data'
import * as Core from '../store'

import {ContextMenu, ContextMenuHandler, ContextMenuItemSpec, useContextMenuHandler} from './ContextMenu'

export interface FSWorkspaceContextMenu {

    newPrimary?: Omit<ContextMenuItemSpec, 'submenuItems'>[]
    newSecondary?: Omit<ContextMenuItemSpec, 'submenuItems'>[]
}

export interface FSWorkspacePanelProps {
    workspaceId: string
    contextMenu?: FSWorkspaceContextMenu
}

const fsWorkspacePanelClasses = createClasses("FileSystemPanel", [])

export const FSWorkspacePanel: React.FC<FSWorkspacePanelProps> = (props) => {

    const workspace = Core.useTypedSelector(state => Core.selectFSWorkspace(state, props.workspaceId))
    const dispatch = Core.useThunkDispatch()

    const [selectedPath, setSelectedPath] = React.useState<string>("/")

    const {contextMenuProps, handleContextMenu} = useContextMenuHandler()

    const newPrimaryContextMenuItems = props.contextMenu?.newPrimary ?? []
    const newSecondaryContextMenuItems = props.contextMenu?.newSecondary ?? []

    const classes = fsWorkspacePanelClasses

    if(workspace.status == 'Pending') {
        return <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} padding={2}>
            <Button variant="contained" onClick={() => dispatch(Core.FSActions.loadWorkspace(props.workspaceId))}>Load Files</Button>
        </Box>
    } else {
        return <List
            className={classes.root}
            component="div" dense
            onContextMenu={handleContextMenu}
            sx={{
                flex: '1 0 0'
            }}
        >
            <DirectoryDisplay
                directoryId={workspace.rootDirectoryId}
                directories={workspace.directoriesById}
                depth={1}
                folds={workspace.folds}
                toggleFold={(directoryId) => dispatch(Core.FSActions.toggleFold(props.workspaceId, directoryId))}
                selectedEntry={selectedPath}
                onSelect={(path) => setSelectedPath(path)}
                onContextMenu={handleContextMenu}
            />
            <ContextMenu {...contextMenuProps} menuItems={[
                {
                    label: "New",
                    submenuItems: [
                        ...newPrimaryContextMenuItems,
                        {
                            label: "Directory",
                            icon: FolderIcon,
                            divider: newSecondaryContextMenuItems.length > 0
                        },
                        ...newSecondaryContextMenuItems
                    ],
                    divider: true
                },
                {
                    label: "Cut",
                    icon: ContentCutIcon,
                    keyboardShortcut: StandardShortcuts.ContentCut,
                    availableFor: ['directory', 'file'],
                },
                {
                    label: "Copy",
                    icon: ContentCopyIcon,
                    keyboardShortcut: StandardShortcuts.ContentCopy,
                    availableFor: ['directory', 'file'],
                },
                {
                    label: "Paste",
                    icon: ContentPasteIcon,
                    keyboardShortcut: StandardShortcuts.ContentPaste,
                    availableFor: ['directory', 'file'],
                    divider: true,
                },
                {
                    label: "Delete",
                    icon: DeleteIcon,
                    availableFor: ['directory', 'file'],
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
            <span>
                <IconButton
                    size="small"
                    disabled={workspace.overallFold == 'UnfoldAll'}
                    onClick={() => dispatch(Core.FSActions.unfoldAll(workspaceId))}
                >
                <UnfoldMoreIcon/>
            </IconButton>
            </span>
        </Tooltip>
        <Tooltip title="Collapse All">
            <span>
                <IconButton
                    size="small"
                    disabled={workspace.overallFold == 'FoldAll'}
                    onClick={() => dispatch(Core.FSActions.foldAll(workspaceId))}
                >
                <UnfoldLessIcon/>
            </IconButton>
            </span>
        </Tooltip>
    </>
}


export interface DirectoryDisplayProps {
    directoryId: FileSystem.DirectoryId
    directories: FileSystem.DirectoriesById
    depth: number
    folds: Record<FileSystem.DirectoryId, 'Fold' | 'Unfold'>
    toggleFold: (directoryId: string) => void
    selectedEntry: FileSystem.EntryId
    onSelect: (entryId: FileSystem.EntryId) => void
    onContextMenu: ContextMenuHandler
}

export const DirectoryDisplay: React.FC<DirectoryDisplayProps> = ({directoryId, directories, depth, folds, toggleFold, selectedEntry, onSelect, onContextMenu}) => {
    let directory = directories[directoryId]
    let open = folds[directoryId] == 'Unfold'

    const handleToggleFold = () => toggleFold(directoryId)

    const handleContextMenu: ContextMenuHandler = (event, entryType, entryId) => {
        event.stopPropagation()
        onSelect(entryId)
        onContextMenu(event, entryType, entryId)
    }

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
                selected={selectedEntry == directory.directoryId}
                onClick={() => onSelect(directory.directoryId)}
                onContextMenu={(ev) => handleContextMenu(ev, 'directory', directory.directoryId)}
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
                {directory.subDirectoryIds.map(subDirectoryId =>
                    <DirectoryDisplay
                        key={subDirectoryId}
                        directoryId={subDirectoryId}
                        directories={directories}
                        depth={depth+1}
                        folds={folds}
                        toggleFold={toggleFold}
                        selectedEntry={selectedEntry}
                        onSelect={onSelect}
                        onContextMenu={onContextMenu}
                    />
                )}
                {directory.files.map(file =>
                    <ListItemButton
                        key={file.fileId} dense
                        selected={selectedEntry == file.fileId}
                        onClick={() => onSelect(file.fileId)}
                        onContextMenu={(ev) => handleContextMenu(ev, 'file', file.fileId)}
                        sx={{ pl: (depth+1)*2 }}
                    >
                        <ListItemText primary={file.name}/>
                    </ListItemButton>
                )}
            </List>
        </Collapse>
    </>
}