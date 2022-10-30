import {FileSystem, UUID} from '../../data'

export interface FSState {
    workspacesById: Record<UUID, FSState.WorkspaceState>
}

export namespace FSState {
    export const Default: FSState = {
        workspacesById: {}
    }

    export interface WorkspaceState extends FileSystem.Workspace {
        status: 'Closed' | 'Pending' | 'Open'
        folds: Record<FileSystem.DirectoryId, 'Fold' | 'Unfold'>
        overallFold: 'FoldAll' | 'Mixed' | 'UnfoldAll'
    }
    export namespace Workspace {
        export const Default: WorkspaceState = {
            status: 'Closed',
            rootDirectoryId: null,
            directoriesById: {},
            filesById: {},
            folds: {},
            overallFold: 'Mixed'
        }
    }

    export const createFolds = (directoryIds: FileSystem.DirectoryId[], defaultValue: 'Fold' | 'Unfold'): WorkspaceState['folds'] => {
        let result = {}
        for(let directoryId of directoryIds) {
            result[directoryId] = defaultValue
        }
        return result
    }
}