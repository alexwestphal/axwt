
import {Selector} from 'reselect'

import {FileSystem} from '../../data'

import * as Core from '../Core'
import {FSState} from './FSState'



export const selectFSWorkspace: Selector<Core.State, FSState.WorkspaceState, [string]> =
    (state, workspaceId) => state.fs.workspacesById[workspaceId] ?? FSState.Workspace.Default

export const selectDirectoryInWorkspace: Selector<FileSystem.Workspace, FileSystem.Directory, [FileSystem.DirectoryId]> =
    (workspace, directoryId) => {
        let directory = workspace.directoriesById[directoryId]
        if(directory == null) throw new Error(`No such Directory(${directoryId})`)
        return directory
    }

export const selectFileInWorkspace: Selector<FileSystem.Workspace, FileSystem.File, [FileSystem.FileId]> =
    (workspace, fileId) => {
        let file = workspace.filesById[fileId]
        if(file == null) throw new Error(`No such File(${fileId})`)
        return file
    }

