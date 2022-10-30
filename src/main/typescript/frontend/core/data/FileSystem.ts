import {UUID} from './UUID'

export namespace FileSystem {

    export type FileId = UUID
    export type DirectoryId = UUID
    export type EntryId = FileId | DirectoryId

    export interface File {
        readonly fileId: FileSystem.FileId
        readonly directoryId: FileSystem.DirectoryId
        readonly type: 'file'
        readonly name: string
        readonly path: string
    }

    export interface Directory {
        readonly directoryId: FileSystem.DirectoryId
        readonly parentDirectoryId: FileSystem.DirectoryId | null
        readonly type: 'directory'
        readonly name: string
        readonly path: string

        readonly subDirectoryIds: ReadonlyArray<FileSystem.DirectoryId>
        readonly fileIds: ReadonlyArray<FileSystem.FileId>
    }

    export interface Workspace {
        readonly rootDirectoryId: FileSystem.DirectoryId
        readonly directoriesById: Record<FileSystem.DirectoryId, FileSystem.Directory>
        readonly filesById: Record<FileSystem.FileId, FileSystem.File>
    }

    export type Entry = FileSystem.File | FileSystem.Directory

    export const isDirectory = (entry: Entry): entry is Directory => entry.type == 'directory'

    export interface BuildTreeResult {
        directoryId: FileSystem.DirectoryId
        directoriesById: Record<FileSystem.DirectoryId, FileSystem.Directory>
        filesById: Record<FileSystem.FileId, FileSystem.File>

        directoryHandles: Record<FileSystem.DirectoryId, FileSystemDirectoryHandle>
    }

    export const fromNative = async (
        dirHandle: FileSystemDirectoryHandle,
        parentDirectoryId: FileSystem.DirectoryId = null,
        rootHandle: FileSystemDirectoryHandle = dirHandle
    ): Promise<BuildTreeResult> => {

        let directoryId = UUID.create()

        let subDirectoryIds: FileSystem.DirectoryId[] = []
        let fileIds: FileSystem.FileId[] = []

        let directoriesById: Record<FileSystem.DirectoryId, FileSystem.Directory> = {}
        let filesById: Record<FileSystem.FileId, FileSystem.File> = {}
        let directoryHandles: Record<FileSystem.DirectoryId, FileSystemDirectoryHandle> = {}

        for await(let entryHandle of dirHandle.values()) {
            if(entryHandle.kind == 'directory') {
                let subResult = await fromNative(entryHandle, directoryId, rootHandle)

                // Add to the list of subdirectories
                subDirectoryIds.push(subResult.directoryId)

                Object.assign(directoriesById, subResult.directoriesById)
                Object.assign(filesById, subResult.filesById)

                Object.assign(directoryHandles, subResult.directoryHandles)
            } else {
                let fileId = UUID.create()
                fileIds.push(fileId)

                let pathParts = await rootHandle.resolve(entryHandle)
                filesById[fileId] = { fileId, directoryId, type: 'file', name: entryHandle.name, path: '/' + pathParts.join('/') }
            }
        }

        // Sort the directories alphabetically
        subDirectoryIds.sort((dirIdA, dirIdB) =>
            directoriesById[dirIdA].name.localeCompare(directoriesById[dirIdB].name)
        )

        // Sort the files alphabetically
        fileIds.sort((fileIdA, fileIdB) =>
            filesById[fileIdA].name.localeCompare(filesById[fileIdB].name))

        let pathParts = await rootHandle.resolve(dirHandle)
        directoriesById[directoryId] = {
            directoryId,
            parentDirectoryId,
            type: 'directory',
            name: dirHandle.name,
            path: '/' + pathParts.join('/'),
            subDirectoryIds, fileIds
        }
        directoryHandles[directoryId] = dirHandle

        return {directoryId, directoriesById, filesById, directoryHandles}
    }
}



