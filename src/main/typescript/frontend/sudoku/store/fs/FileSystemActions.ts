
import {Action, createAction, FileSystem, UUID} from '@axwt/core'

import * as SU from '../SU'

import {FileSystemState} from './FileSystemState'

export namespace FileSystemActions {

    export type FoldAll = Action<'su/fs/foldAll'>

    export type Init = Action<'su/fs/init', FileSystemState['status'], { directoryHandleId?: UUID }>

    export type Load = Action<'su/fs/load'>

    export type OpenFS = Action<'su/fs/openFS', FileSystem.Directory, { directoryHandleId: UUID }>

    export type ToggleFold = Action<'su/fs/toggleFold', string>

    export type UnfoldAll = Action<'su/fs/unfoldAll'>

    export type Any = FoldAll | Init | Load | OpenFS | ToggleFold | UnfoldAll


    export const foldAll = (): FoldAll => createAction('su/fs/foldAll')

    export const init = (): SU.ThunkAction =>
        async (dispatch, getState, { handles, suDatabase }) => {

            const db = await suDatabase
            let tx = db.transaction('kv', 'readonly')
            let store = tx.objectStore('kv')
            let kvEntry = await store.get("DirectoryHandle")

            if(kvEntry !== undefined) {
                let dirHandle = kvEntry.value as FileSystemDirectoryHandle
                let directoryHandleId = UUID.create()
                handles[directoryHandleId] = dirHandle

                dispatch(createAction<'su/fs/init', FileSystemState['status']>('su/fs/init', "Pending", { directoryHandleId }))
            } else {
                dispatch(createAction<'su/fs/init', FileSystemState['status']>('su/fs/init', "Closed"))
            }
        }

    export const load = (): SU.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let {directoryHandleId} = getState().su.fs

            let dirHandle: FileSystemDirectoryHandle = handles[directoryHandleId]

            await dirHandle.requestPermission({ mode: 'readwrite' })

            let fsDir = await FileSystem.buildTree(dirHandle)

            dispatch(createAction('su/fs/openFS', fsDir, { directoryHandleId }))
        }

    export const openFS = (): SU.ThunkAction =>
        async (dispatch, getState, { handles, suDatabase }) => {

            if(window.showDirectoryPicker === undefined) {
                console.warn("window.showDirectoryPicker is not supported")
                return
            }

            let dirHandle
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

            const db = await suDatabase
            let tx = db.transaction('kv', 'readwrite')
            let store = tx.objectStore('kv')
            store.put({ key: "DirectoryHandle", value: dirHandle })
            await tx.done

            let directoryHandleId = UUID.create()
            handles[directoryHandleId] = dirHandle

            let fsDir = await FileSystem.buildTree(dirHandle)

            dispatch(createAction('su/fs/openFS', fsDir, { directoryHandleId }))
        }

    export const toggleFold = (dirPath: string): ToggleFold =>
        createAction('su/fs/toggleFold', dirPath)

    export const unfoldAll = (): UnfoldAll => createAction('su/fs/unfoldAll')
}