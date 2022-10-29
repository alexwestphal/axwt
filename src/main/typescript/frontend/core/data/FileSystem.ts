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
        readonly files: ReadonlyArray<FileSystem.File>
    }

    export type Entry = FileSystem.File | FileSystem.Directory

    export type DirectoriesById = Record<DirectoryId, Directory>

    export const isDirectory = (entry: Entry): entry is Directory => entry.type == 'directory'

    export interface BuildTreeResult {
        directoryId: FileSystem.DirectoryId
        directories: Record<FileSystem.DirectoryId, FileSystem.Directory>
        directoryHandles: Record<FileSystem.DirectoryId, FileSystemDirectoryHandle>
    }

    export const fromNative = async (
        dirHandle: FileSystemDirectoryHandle,
        parentDirectoryId: FileSystem.DirectoryId = null,
        rootHandle: FileSystemDirectoryHandle = dirHandle
    ): Promise<BuildTreeResult> => {

        let directoryId = UUID.create()

        let subDirectoryIds: FileSystem.DirectoryId[] = []
        let directories: Record<FileSystem.DirectoryId, FileSystem.Directory> = {}
        let directoryHandles: Record<FileSystem.DirectoryId, FileSystemDirectoryHandle> = {}
        let files: FileSystem.File[] = []

        for await(let entryHandle of dirHandle.values()) {
            if(entryHandle.kind == 'directory') {
                let subResult = await fromNative(entryHandle, directoryId, rootHandle)

                // Add to the list of subdirectories
                subDirectoryIds.push(subResult.directoryId)

                Object.assign(directories, subResult.directories)
                Object.assign(directoryHandles, subResult.directoryHandles)

                directoryHandles = { ...directoryHandles, ...subResult.directoryHandles }
            } else {
                let pathParts = await rootHandle.resolve(entryHandle)
                files.push({ fileId: UUID.create(), directoryId, type: 'file', name: entryHandle.name, path: '/' + pathParts.join('/') })
            }
        }

        // Sort the directories alphabetically
        subDirectoryIds.sort((dirIdA, dirIdB) =>
            directories[dirIdA].name.localeCompare(directories[dirIdB].name)
        )

        // Sort the files alphabetically
        files.sort((fileA, fileB) => fileA.name.localeCompare(fileB.name))

        let pathParts = await rootHandle.resolve(dirHandle)
        directories[directoryId] = {
            directoryId,
            parentDirectoryId,
            type: 'directory',
            name: dirHandle.name,
            path: '/' + pathParts.join('/'),
            subDirectoryIds, files,
        }
        return {directoryId, directories, directoryHandles}
    }
}



