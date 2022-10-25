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
        directoryHandleId: string
        rootEntry: FileSystem.Directory
        folds: { [path: string]: 'Fold' | 'Unfold' }
        overallFold: 'FoldAll' | 'Mixed' | 'UnfoldAll'
    }
    export namespace Workspace {
        export const Default: Workspace = {
            status: 'Closed',
            directoryHandleId: null,
            rootEntry: null,
            folds: {},
            overallFold: 'Mixed'
        }
    }

    export const createFolds = (paths: string[], defaultValue: 'Fold' | 'Unfold'): Workspace['folds'] => {
        let result = {}
        for(let path of paths) {
            result[path] = defaultValue
        }
        return result
    }
}