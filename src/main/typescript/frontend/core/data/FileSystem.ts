
export namespace FileSystem {

    export interface File {
        readonly type: 'file'
        readonly name: string
        readonly path: string
    }

    export interface Directory {
        readonly type: 'directory'
        readonly name: string
        readonly path: string

        readonly entries: ReadonlyArray<FileSystem.Entry>
    }

    export type Entry = FileSystem.File | FileSystem.Directory

    export const isDirectory = (entry: Entry): entry is Directory => entry.type == 'directory'


    export const buildTree = async (dirHandle: FileSystemDirectoryHandle, rootHandle: FileSystemDirectoryHandle = dirHandle): Promise<FileSystem.Directory> => {
        let directories: FileSystem.Entry[] = []
        let files: FileSystem.Entry[] = []

        for await(let entryHandle of dirHandle.values()) {
            if(entryHandle.kind == 'directory') {
                directories.push(await buildTree(entryHandle, rootHandle))
            } else {
                let pathParts = await rootHandle.resolve(entryHandle)
                files.push({ type: 'file', name: entryHandle.name, path: '/' + pathParts.join('/') })
            }
        }

        let entries = [
            ...directories.sort((a,b) => a.name.localeCompare(b.name) ),
            ...files.sort((a,b) => a.name.localeCompare(b.name) ),
            ]

        let pathParts = await rootHandle.resolve(dirHandle)
        return { type: 'directory', name: dirHandle.name, path: '/' + pathParts.join('/'), entries }
    }

    export const getDirPathList = (directory: FileSystem.Directory): string[] => {
        let result: string[] = [directory.path]

        for(let entry of directory.entries) {
            if(isDirectory(entry)) result.push(...getDirPathList(entry))
        }
        return result
    }
}



