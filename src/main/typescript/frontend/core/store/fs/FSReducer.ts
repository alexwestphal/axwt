
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import {ArrayUtils} from '@axwt/util'

import * as Core from '../Core'

import {FSState} from './FSState'


export const FSReducer: Reducer<FSState> = produce((draft: Draft<FSState>, action: Core.AnyAction) => {
    switch(action.type) {
        case 'su/fs/foldAll': {
            let workspace = draft.workspaces[action.meta.workspaceId]
            workspace.folds = FSState.createFolds(Object.keys(workspace.directoriesById), 'Fold')
            workspace.overallFold = 'FoldAll'
            break
        }
        case 'su/fs/workspaceInit': {
            draft.workspaces[action.meta.workspaceId] = castDraft({
                ...FSState.Workspace.Default,
                status: action.payload,
                rootDirectoryId: action.meta.rootDirectoryId
            })
            break
        }
        case 'su/fs/workspaceOpen':
            let workspace = draft.workspaces[action.meta.workspaceId] ?? castDraft(FSState.Workspace.Default)
            workspace.status = 'Open'

            workspace.rootDirectoryId = action.meta.rootDirectoryId
            workspace.directoriesById = castDraft(action.payload)

            workspace.folds = FSState.createFolds(Object.keys(workspace.directoriesById), 'Fold')
            workspace.folds[action.meta.rootDirectoryId] = 'Unfold'
            workspace.overallFold = 'Mixed'
            break
        case 'su/fs/toggleFold': {
            let workspace = draft.workspaces[action.meta.workspaceId]
            workspace.folds[action.meta.directoryId] = workspace.folds[action.meta.directoryId] == 'Fold' ? 'Unfold' : 'Fold'
            let directoryIds = Object.keys(workspace.directoriesById)
            let foldCount = ArrayUtils.occurrences(directoryIds.map(dirId => workspace.folds[dirId]), 'Fold')
            workspace.overallFold = foldCount == 0 ? 'UnfoldAll' : foldCount == directoryIds.length ? 'FoldAll' : 'Mixed'
            break
        }
        case 'su/fs/unfoldAll': {
            let workspace = draft.workspaces[action.meta.workspaceId]
            workspace.folds = FSState.createFolds(Object.keys(workspace.directoriesById), 'Unfold')
            workspace.overallFold = 'UnfoldAll'
            break
        }

    }
}, FSState.Default)


