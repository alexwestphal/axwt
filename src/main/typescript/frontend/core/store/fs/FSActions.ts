
import {Action, createAction, FileSystem, UUID} from '@axwt/core'

import * as Core from '../Core'

import {selectFSWorkspace} from './FSSelectors'
import {FSState} from './FSState'


export namespace FSActions {

    export type WorkspaceMeta = { workspaceId: string }
    type WorkspaceStatus = FSState.Workspace['status']

    export type FoldAll = Action<'su/fs/foldAll', null, WorkspaceMeta>
    export type ToggleFold = Action<'su/fs/toggleFold', string, WorkspaceMeta>
    export type UnfoldAll = Action<'su/fs/unfoldAll', null, WorkspaceMeta>

    export type WorkspaceInit = Action<'su/fs/workspaceInit', WorkspaceStatus, WorkspaceMeta & { directoryHandleId?: UUID }>
    export type WorkspaceLoad = Action<'su/fs/workspaceLoad', null, WorkspaceMeta>
    export type WorkspaceOpen = Action<'su/fs/workspaceOpen', FileSystem.Directory, WorkspaceMeta & { directoryHandleId: UUID }>

    export type Any = FoldAll | ToggleFold | UnfoldAll | WorkspaceInit | WorkspaceLoad | WorkspaceOpen


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
                let directoryHandleId = UUID.create()
                handles[directoryHandleId] = dirHandle

                action = createAction('su/fs/workspaceInit', "Pending", { workspaceId, directoryHandleId })
            } else {
                action = createAction('su/fs/workspaceInit', "Closed", { workspaceId })
            }
            dispatch(action)
        }

    export const loadWorkspace = (workspaceId: string): Core.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let workspace = selectFSWorkspace(getState(), workspaceId)

            let dirHandle: FileSystemDirectoryHandle = handles[workspace.directoryHandleId]

            await dirHandle.requestPermission({ mode: 'readwrite' })

            let fsDir = await FileSystem.buildTree(dirHandle)

            dispatch(createAction('su/fs/workspaceOpen', fsDir, { workspaceId, directoryHandleId: workspace.directoryHandleId }))
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

            let directoryHandleId = UUID.create()
            handles[directoryHandleId] = dirHandle

            let fsDir = await FileSystem.buildTree(dirHandle)

            dispatch(createAction('su/fs/workspaceOpen', fsDir, { workspaceId, directoryHandleId }))
        }

    export const toggleFold = (workspaceId: string, dirPath: string): ToggleFold =>
        createAction('su/fs/toggleFold', dirPath, { workspaceId })

    export const unfoldAll = (workspaceId: string): UnfoldAll => createAction('su/fs/unfoldAll', null, { workspaceId })
}