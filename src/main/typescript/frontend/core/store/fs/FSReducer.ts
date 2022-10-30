
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import {ArrayUtils} from '@axwt/util'

import * as Core from '../Core'

import {FSState} from './FSState'


export const FSReducer: Reducer<FSState> = produce((draft: Draft<FSState>, action: Core.AnyAction) => {
    switch(action.type) {
        case 'fs/deleteDirectory': {
            let directory = action.payload
            let {workspaceId, directoryId} = action.meta
            let workspace = draft.workspacesById[workspaceId]
            let parentDirectory = workspace.directoriesById[directory.parentDirectoryId]

            ArrayUtils.remove(parentDirectory.subDirectoryIds, directoryId)
            delete workspace.directoriesById[directoryId]
            delete workspace.folds[directoryId]
            for(let fileId of directory.fileIds) {
                delete workspace.filesById[fileId]
            }
            break
        }
        case 'fs/deleteFile': {
            let file = action.payload
            let {workspaceId, fileId} = action.meta
            let workspace = draft.workspacesById[workspaceId]
            let directory = workspace.directoriesById[file.directoryId]

            ArrayUtils.remove(directory.fileIds, fileId)
            delete workspace.filesById[fileId]
            break
        }
        case 'fs/foldAll': {
            let workspace = draft.workspacesById[action.meta.workspaceId]
            workspace.folds = FSState.createFolds(Object.keys(workspace.directoriesById), 'Fold')
            workspace.overallFold = 'FoldAll'
            break
        }
        case 'fs/workspaceInit': {
            draft.workspacesById[action.meta.workspaceId] = castDraft({
                ...FSState.Workspace.Default,
                status: action.payload,
                rootDirectoryId: action.meta.rootDirectoryId
            })
            break
        }
        case 'fs/workspaceOpen':
            let workspace = draft.workspacesById[action.meta.workspaceId] ?? castDraft(FSState.Workspace.Default)
            workspace.status = 'Open'

            workspace.rootDirectoryId = action.meta.rootDirectoryId
            workspace.directoriesById = castDraft(action.payload.directoriesById)
            workspace.filesById = castDraft(action.payload.filesById)

            workspace.folds = FSState.createFolds(Object.keys(workspace.directoriesById), 'Fold')
            workspace.folds[action.meta.rootDirectoryId] = 'Unfold'
            workspace.overallFold = 'Mixed'
            break
        case 'fs/toggleFold': {
            let workspace = draft.workspacesById[action.meta.workspaceId]
            workspace.folds[action.meta.directoryId] = workspace.folds[action.meta.directoryId] == 'Fold' ? 'Unfold' : 'Fold'
            let directoryIds = Object.keys(workspace.directoriesById)
            let foldCount = ArrayUtils.occurrences(directoryIds.map(dirId => workspace.folds[dirId]), 'Fold')
            workspace.overallFold = foldCount == 0 ? 'UnfoldAll' : foldCount == directoryIds.length ? 'FoldAll' : 'Mixed'
            break
        }
        case 'fs/unfoldAll': {
            let workspace = draft.workspacesById[action.meta.workspaceId]
            workspace.folds = FSState.createFolds(Object.keys(workspace.directoriesById), 'Unfold')
            workspace.overallFold = 'UnfoldAll'
            break
        }

    }
}, FSState.Default)


