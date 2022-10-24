import {FileSystem} from '@axwt/core/data'

export interface FileSystemState {
    status: 'Closed' | 'Pending' | 'Open'
    directoryHandleId: string | null
    rootEntry: FileSystem.Directory
    folds: { [path: string]: 'Fold' | 'Unfold' }
    overallFold: 'FoldAll' | 'Mixed' | 'UnfoldAll'
}

export namespace FileSystemState {
    export const Default: FileSystemState = {
        status: 'Closed',
        directoryHandleId: null,
        rootEntry: null,
        folds: {},
        overallFold: 'Mixed'
    }

    export const createFolds = (paths: string[], defaultValue: 'Fold' | 'Unfold'): FileSystemState['folds'] => {
        let result = {}
        for(let path of paths) {
            result[path] = defaultValue
        }
        return result
    }
}