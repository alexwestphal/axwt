
import {Action, createAction, FileSystem, UUID} from '@axwt/core'

import * as Core from '../Core'

import {selectDirectoryInWorkspace, selectFileInWorkspace, selectFSWorkspace} from './FSSelectors'
import {FSState} from './FSState'


export namespace FSActions {

    export type WorkspaceMeta = { workspaceId: string }
    type WorkspaceStatus = FSState.WorkspaceState['status']

    export type DeleteDirectory = Action<'fs/deleteDirectory', FileSystem.Directory, WorkspaceMeta & { directoryId: FileSystem.DirectoryId }>
    export type DeleteFile = Action<'fs/deleteFile', FileSystem.File, WorkspaceMeta & { fileId: FileSystem.FileId }>

    export type FoldAll = Action<'fs/foldAll', null, WorkspaceMeta>
    export type ToggleFold = Action<'fs/toggleFold', null, WorkspaceMeta & { directoryId: FileSystem.DirectoryId }>
    export type UnfoldAll = Action<'fs/unfoldAll', null, WorkspaceMeta>

    export type WorkspaceInit = Action<'fs/workspaceInit', WorkspaceStatus, WorkspaceMeta & { rootDirectoryId?: UUID }>
    export type WorkspaceLoad = Action<'fs/workspaceLoad', null, WorkspaceMeta>
    export type WorkspaceOpen = Action<'fs/workspaceOpen', Pick<FSState.WorkspaceState, 'directoriesById' | 'filesById'>, WorkspaceMeta & { rootDirectoryId: UUID }>

    export type Any = DeleteDirectory | DeleteFile | FoldAll | ToggleFold | UnfoldAll | WorkspaceInit | WorkspaceLoad | WorkspaceOpen

    export const deleteDirectory = (workspaceId: string, directoryId: FileSystem.DirectoryId): Core.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let state = getState()
            let workspace = selectFSWorkspace(state, workspaceId)
            let directory = selectDirectoryInWorkspace(workspace, directoryId)
            if(directory.parentDirectoryId == null) throw new Error("Can't delete a RootDirectory")
            let parentDirHandle = handles.get(directory.parentDirectoryId) as FileSystemDirectoryHandle

            await parentDirHandle.removeEntry(directory.name, { recursive: true })

            dispatch(createAction('fs/deleteDirectory', directory, { workspaceId, directoryId }))
        }

    export const deleteFile = (workspaceId: string, fileId: FileSystem.FileId): Core.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let state = getState()
            let workspace = selectFSWorkspace(state, workspaceId)
            let file = selectFileInWorkspace(workspace, fileId)
            let dirHandle = handles.get(file.directoryId) as FileSystemDirectoryHandle

            await dirHandle.removeEntry(file.name)

            dispatch(createAction('fs/deleteFile', file, { workspaceId, fileId }))
        }

    export const foldAll = (workspaceId: string): FoldAll => createAction('fs/foldAll', null, { workspaceId })

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
                handles.set(rootDirectoryId, dirHandle)

                action = createAction('fs/workspaceInit', "Pending", { workspaceId, rootDirectoryId })
            } else {
                action = createAction('fs/workspaceInit', "Closed", { workspaceId })
            }
            dispatch(action)
        }

    export const loadWorkspace = (workspaceId: string): Core.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let workspace = selectFSWorkspace(getState(), workspaceId)

            let dirHandle: FileSystemDirectoryHandle = handles.get(workspace.rootDirectoryId)

            await dirHandle.requestPermission({ mode: 'readwrite' })

            let {directoryId, directoriesById, filesById, directoryHandles} = await FileSystem.fromNative(dirHandle)
            for(let dirId of Object.keys(directoryHandles)) {
                handles.set(dirId, directoryHandles[dirId])
            }

            // Delete the old directoryId mapping
            handles.delete(workspace.rootDirectoryId)

            dispatch(createAction('fs/workspaceOpen', { directoriesById, filesById }, { workspaceId, rootDirectoryId: directoryId }))
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

            let {directoryId, directoriesById, filesById, directoryHandles} = await FileSystem.fromNative(dirHandle)
            for(let dirId in Object.keys(directoryHandles)) {
                handles.set(dirId, directoryHandles[dirId])
            }

            dispatch(createAction('fs/workspaceOpen', { directoriesById, filesById }, { workspaceId, rootDirectoryId: directoryId }))
        }

    export const toggleFold = (workspaceId: string, directoryId: FileSystem.DirectoryId): ToggleFold =>
        createAction('fs/toggleFold', null, { workspaceId, directoryId })

    export const unfoldAll = (workspaceId: string): UnfoldAll => createAction('fs/unfoldAll', null, { workspaceId })
}