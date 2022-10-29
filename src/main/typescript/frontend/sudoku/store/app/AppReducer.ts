
import {Reducer} from 'redux'
import produce, {castDraft, Draft} from 'immer'

import * as SU from '../SU'

import {AppState} from './AppState'


export const AppReducer: Reducer<AppState> = produce((draft: Draft<AppState>, action: SU.AnyAction) => {
    switch(action.type) {
        case 'su/app/closeBoard':
            draft.active = false
            draft.appMode = 'Define'
            draft.saveStatus = 'Unsaved'
            draft.saveFileHandleId = null
            break
        case 'su/app/saveBoard':
            draft.saveStatus = 'Saved'
            draft.saveFileHandleId = action.meta.saveFileHandleId
            break
        case 'su/app/setMode':
            draft.appMode = action.payload
            break
        case 'su/app/setNewBoardDialogOpen':
            draft.newBoardDialogOpen = action.payload
            break


        case 'su/board/newBoard':
            draft.active = true
            draft.saveStatus = 'Unsaved'
            draft.saveFileHandleId = null
            break

        case 'su/board/clearCellValue':
        case 'su/board/setCellValue':
            if(draft.saveStatus == 'Saved') draft.saveStatus = 'Dirty'
            break
    }
}, AppState.Default)