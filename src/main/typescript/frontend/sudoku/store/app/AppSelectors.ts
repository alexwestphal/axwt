
import {createSelector, Selector} from 'reselect'

import {AppMode, SaveStatus} from '../../data'

import * as SU from '../SU'
import {AppState} from './AppState'


export const selectAppState: Selector<SU.RootState, AppState> =
    (state) => state.su.app

export const selectAppMode: Selector<SU.RootState, AppMode> =
    (state) => state.su.app.appMode

export const selectSaveStatus: Selector<SU.RootState, SaveStatus> =
    (state) => state.su.app.saveStatus