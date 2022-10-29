
import {Action, createAction, UUID} from '@axwt/core'

import {AppMode, BoardSave} from '../../data'

import * as SU from '../SU'
import {selectAppState, selectBoardState} from '@axwt/sudoku/store'

export namespace AppActions {

    export type ChangeRedo = Action<'su/app/redoChange'>
    export type ChangeUndo = Action<'su/app/undoChange'>

    export type CloseBoard = Action<'su/app/closeBoard'>

    export type LoadBoard = Action<'su/app/loadBoard', BoardSave>

    export type SaveBoard = Action<'su/app/saveBoard', BoardSave, { saveFileHandleId: UUID }>

    export type SetMode = Action<'su/app/setMode', AppMode>

    export type SetNewBoardDialogOpen = Action<'su/app/setNewBoardDialogOpen', boolean>

    export type Any = ChangeRedo | ChangeUndo | CloseBoard | LoadBoard | SaveBoard | SetMode | SetNewBoardDialogOpen

    export const changeRedo = (): ChangeRedo => createAction('su/app/redoChange')
    export const changeUndo = (): ChangeUndo => createAction('su/app/undoChange')

    export const closeBoard = (): CloseBoard => createAction('su/app/closeBoard')

    export const saveBoard = (): SU.ThunkAction =>
        async (dispatch, getState, { handles }) => {
            let state = getState()

            let appState = selectAppState(state)
            let boardState = selectBoardState(state)

            let fileHandleId = appState.saveFileHandleId ?? UUID.create()
            let fileHandle: FileSystemFileHandle
            if(appState.saveStatus == 'Unsaved') {
                try {
                    fileHandle = await window.showSaveFilePicker({
                        suggestedName: boardState.boardName+".sudoku.json",
                        types: [{ description: 'JSON', accept: {'application/json': ['.json']} }]
                    })
                    handles[fileHandleId] = fileHandle
                } catch(ex) {
                    console.error(ex)
                }
            } else if(appState.saveStatus == 'Dirty') {
                fileHandle = handles[appState.saveFileHandleId]
            }

            if(fileHandle) {
                let stream = await fileHandle.createWritable()

                let saveData: BoardSave = {
                    boardId: UUID.create(),
                    boardName: boardState.boardName,
                    boardSize: boardState.boardSize,
                    boardType: boardState.boardType,
                    givenBoard: boardState.current.cells.map(cell => cell.value)
                }

                await stream.write(JSON.stringify(saveData))
                await stream.close()

                dispatch(createAction('su/app/saveBoard', saveData, { saveFileHandleId: fileHandleId }))
            }
        }

    export const setMode = (mode: AppMode): SetMode => createAction('su/app/setMode', mode)

    export const setNewBoardDialogOpen = (open: boolean): SetNewBoardDialogOpen =>
        createAction('su/app/setNewBoardDialogOpen', open)
}