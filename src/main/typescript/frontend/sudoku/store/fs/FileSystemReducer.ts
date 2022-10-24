
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import {FileSystem} from '@axwt/core'
import {ArrayUtils} from '@axwt/util'

import * as SU from '../SU'

import {FileSystemState} from './FileSystemState'


export const FileSystemReducer: Reducer<FileSystemState> = produce((draft: Draft<FileSystemState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/fs/foldAll':
            draft.folds = FileSystemState.createFolds(FileSystem.getDirPathList(draft.rootEntry), 'Fold')
            draft.overallFold = 'FoldAll'
            break
        case'su/fs/init':
            draft.status = action.payload
            draft.directoryHandleId = action.meta.directoryHandleId
            break
        case 'su/fs/openFS':
            draft.status = 'Open'
            draft.directoryHandleId = action.meta.directoryHandleId
            draft.rootEntry = castDraft(action.payload)
            draft.folds = FileSystemState.createFolds(FileSystem.getDirPathList(draft.rootEntry), 'Fold')
            draft.folds["/"] = 'Unfold'
            break
        case 'su/fs/toggleFold':
            draft.folds[action.payload] = draft.folds[action.payload] == 'Fold' ? 'Unfold' : 'Fold'
            let paths = Object.values(draft.folds)
            let foldCount = ArrayUtils.occurrences(paths.map(path => draft.folds[path]), 'Fold')
            draft.overallFold = foldCount == 0 ? 'UnfoldAll' : foldCount == paths.length ? 'FoldAll' : 'Mixed'
            break
        case 'su/fs/unfoldAll':
            draft.folds = FileSystemState.createFolds(FileSystem.getDirPathList(draft.rootEntry), 'Unfold')
            draft.overallFold = 'UnfoldAll'
            break
    }
}, FileSystemState.Default)


