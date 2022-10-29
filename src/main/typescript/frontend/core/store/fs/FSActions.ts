
import {Action, createAction, FileSystem, UUID} from '@axwt/core'

import * as Core from '../Core'

import {selectFSWorkspace} from './FSSelectors'
import {FSState} from './FSState'


export namespace FSActions {

    export type WorkspaceMeta = { workspaceId: string }
    type WorkspaceStatus = FSState.Workspace['status']

    export type DeleteFile = Action<'su/fs/delete', null, WorkspaceMeta & { fileId: FileSystem.FileId }>

    export type FoldAll = Action<'su/fs/foldAll', null, WorkspaceMeta>
    export type ToggleFold = Action<'su/fs/toggleFold', null, WorkspaceMeta & { directoryId: FileSystem.DirectoryId }>
    export type UnfoldAll = Action<'su/fs/unfoldAll', null, WorkspaceMeta>

    export type WorkspaceInit = Action<'su/fs/workspaceInit', WorkspaceStatus, WorkspaceMeta & { rootDirectoryId?: UUID }>
    export type WorkspaceLoad = Action<'su/fs/workspaceLoad', null, WorkspaceMeta>
    export type WorkspaceOpen = Action<'su/fs/workspaceOpen', Record<FileSystem.DirectoryId, FileSystem.Directory>, WorkspaceMeta & { rootDirectoryId: UUID }>

    export type Any = DeleteFile | FoldAll | ToggleFold | UnfoldAll | WorkspaceInit | WorkspaceLoad | WorkspaceOpen

    export const deleteFile = (workspaceId: string, fileId: FileSystem.FileId): Core.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let state = getState()
            let workspace = selectFSWorkspace(state, workspaceId)
            let dirHandle = handles[workspace.rootDirectoryId] as FileSystemDirectoryHandle
        }

    export const foldAll = (workspaceId: string): FoldAll => createAction('su/fs/foldAll', null, { workspaceId })

    export const initWorkspace = (workspaceId: string): Core.ThunkAction =>
        async (dispatch, getState, { handles, database }) => {

            const db = await database
            let tx = db.transaction('kv', 'readonly')
            let store = tx.objectStore('kv')
            let kvEntry = await store.get(`WorkspaceDirectoryHandle-${workspaceId}`)

            let action: WorkspaceInit
            if(kvEntry !== undefined) {
                let dirHandle = kvEntry.value as FileSystemDirectoryHandle
                let rootDirectoryId = UUID.create()
                handles[rootDirectoryId] = dirHandle

                action = createAction('su/fs/workspaceInit', "Pending", { workspaceId, rootDirectoryId })
            } else {
                action = createAction('su/fs/workspaceInit', "Closed", { workspaceId })
            }
            dispatch(action)
        }

    export const loadWorkspace = (workspaceId: string): Core.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let workspace = selectFSWorkspace(getState(), workspaceId)

            let dirHandle: FileSystemDirectoryHandle = handles[workspace.rootDirectoryId]

            await dirHandle.requestPermission({ mode: 'readwrite' })

            let {directoryId, directories, directoryHandles} = await FileSystem.fromNative(dirHandle)
            Object.assign(handles, directoryHandles)

            // Delete the old directoryId mapping
            delete handles[workspace.rootDirectoryId]

            dispatch(createAction('su/fs/workspaceOpen', directories, { workspaceId, rootDirectoryId: directoryId }))
        }

    export const openWorkspace = (workspaceId: string): Core.ThunkAction =>
        async (dispatch, getState, { handles, database }) => {

            if(window.showDirectoryPicker === undefined) {
                console.warn("window.showDirectoryPicker is not supported")
                return
            }

            let dirHandle: FileSystemDirectoryHandle
            try {
                dirHandle = await window.showDirectoryPicker()
            } catch(ex) {
                if(ex.name == 'AbortError') {
                    // Aborted by user, do nothing
                    return
                } else {
                    console.error(ex)
                }
                return
            }

            const db = await database
            let tx = db.transaction('kv', 'readwrite')
            let store = tx.objectStore('kv')
            store.put({ key: `WorkspaceDirectoryHandle-${workspaceId}`, value: dirHandle })
            await tx.done

            let {directoryId, directories, directoryHandles} = await FileSystem.fromNative(dirHandle)
            Object.assign(handles, directoryHandles)

            dispatch(createAction('su/fs/workspaceOpen', directories, { workspaceId, rootDirectoryId: directoryId }))
        }

    export const toggleFold = (workspaceId: string, directoryId: FileSystem.DirectoryId): ToggleFold =>
        createAction('su/fs/toggleFold', null, { workspaceId, directoryId })

    export const unfoldAll = (workspaceId: string): UnfoldAll => createAction('su/fs/unfoldAll', null, { workspaceId })
}