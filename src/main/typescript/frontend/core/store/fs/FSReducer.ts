
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import {FileSystem} from '@axwt/core'
import {ArrayUtils} from '@axwt/util'

import * as Core from '../Core'

import {FSState} from './FSState'


export const FSReducer: Reducer<FSState> = produce((draft: Draft<FSState>, action: Core.AnyAction) => {
    switch(action.type) {
        case 'su/fs/foldAll': {
            let workspace = draft.workspaces[action.meta.workspaceId]
            workspace.folds = FSState.createFolds(FileSystem.getDirPathList(workspace.rootEntry), 'Fold')
            workspace.overallFold = 'FoldAll'
            break
        }
        case 'su/fs/workspaceInit': {
            draft.workspaces[action.meta.workspaceId] = castDraft({
                ...FSState.Workspace.Default,
                status: action.payload,
                directoryHandleId: action.meta.directoryHandleId,
            })
            break
        }
        case 'su/fs/workspaceOpen':
            let workspace = draft.workspaces[action.meta.workspaceId] ?? castDraft(FSState.Workspace.Default)
            workspace.status = 'Open'
            workspace.directoryHandleId = action.meta.directoryHandleId
            workspace.rootEntry = castDraft(action.payload)
            workspace.folds = FSState.createFolds(FileSystem.getDirPathList(action.payload), 'Fold')
            workspace.folds["/"] = 'Unfold'
            workspace.overallFold = 'Mixed'
            break
        case 'su/fs/toggleFold': {
            let workspace = draft.workspaces[action.meta.workspaceId]
            workspace.folds[action.payload] = workspace.folds[action.payload] == 'Fold' ? 'Unfold' : 'Fold'
            let paths = Object.values(workspace.folds)
            let foldCount = ArrayUtils.occurrences(paths.map(path => workspace.folds[path]), 'Fold')
            workspace.overallFold = foldCount == 0 ? 'UnfoldAll' : foldCount == paths.length ? 'FoldAll' : 'Mixed'
            break
        }
        case 'su/fs/unfoldAll': {
            let workspace = draft.workspaces[action.meta.workspaceId]
            workspace.folds = FSState.createFolds(FileSystem.getDirPathList(workspace.rootEntry), 'Unfold')
            workspace.overallFold = 'UnfoldAll'
            break
        }

    }
}, FSState.Default)


