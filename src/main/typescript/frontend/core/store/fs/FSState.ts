import {FileSystem} from '@axwt/core/data'

export interface FSState {
    workspaces: { [workspaceName: string]: FSState.Workspace }
}

export namespace FSState {
    export const Default: FSState = {
        workspaces: {}
    }

    export interface Workspace {
        status: 'Closed' | 'Pending' | 'Open'
        rootDirectoryId: FileSystem.DirectoryId
        directoriesById: Record<FileSystem.DirectoryId, FileSystem.Directory>
        folds: Record<FileSystem.DirectoryId, 'Fold' | 'Unfold'>
        overallFold: 'FoldAll' | 'Mixed' | 'UnfoldAll'
    }
    export namespace Workspace {
        export const Default: Workspace = {
            status: 'Closed',
            rootDirectoryId: null,
            directoriesById: {},
            folds: {},
            overallFold: 'Mixed'
        }
    }

    export const createFolds = (directoryIds: FileSystem.DirectoryId[], defaultValue: 'Fold' | 'Unfold'): Workspace['folds'] => {
        let result = {}
        for(let directoryId of directoryIds) {
            result[directoryId] = defaultValue
        }
        return result
    }
}