
import {Reducer} from 'redux'
import produce, {Draft} from 'immer'

import { DisplayActions } from './DisplayActions'
import { DisplayState } from './DisplayState'

export const DisplayReducer: Reducer<DisplayState> = produce((draft: Draft<DisplayState>, action: DisplayActions.Any) => {
    switch (action.type) {
        case 'display/drawerClose':
            switch(action.meta.side) {
                case 'Left':
                    draft.leftDrawer = 'Closed'
                    break
                case 'Right':
                    draft.rightDrawer = 'Closed'
                    break
            }
            break
        case 'display/drawerOpen':
            switch(action.meta.side) {
                case 'Left':
                    draft.leftDrawer = 'Open'
                    break
                case 'Right':
                    draft.rightDrawer = 'Open'
                    break
            }
            break
        case 'display/setFocusBlock':
            draft.focusBlockId = action.payload
            draft.forceFocus = action.meta.force
            break
        case 'display/setTitle':
            draft.title = action.payload
            break
        case 'display/setWindowModeDual':
            draft.windowMode = 'Dual'
            draft.windowSpecNormal = action.meta.normalSpec
            draft.secondaryWindowId = action.meta.secondaryWindowId
            break
        case 'display/setWindowModeNormal':
            draft.windowMode = 'Normal'
            draft.secondaryWindowId = undefined
            break
    }
}, DisplayState.Default)