
import {UUID} from '@axwt/core'

import {AppMode, SaveStatus} from '../../data'


export interface AppState {

    active: boolean
    appMode: AppMode

    saveStatus: SaveStatus
    saveFileHandleId: UUID

    newBoardDialogOpen: boolean
}
export namespace AppState {
    export const Default: AppState = {

        active: false,
        appMode: 'Define',

        saveStatus: 'Unsaved',
        saveFileHandleId: null,

        newBoardDialogOpen: false
    }
}