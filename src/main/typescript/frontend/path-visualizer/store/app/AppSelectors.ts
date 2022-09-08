/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {createSelector, Selector} from 'reselect'

import {UUID} from '@axwt/core'

import {SnackbarOptions} from '../../data'
import * as PV from '../PV'



export const selectSaveFileHandleId: Selector<PV.RootState, UUID> =
    (state) => state.pv.app.saveFileHandleId

export const selectSnackbar: Selector<PV.RootState, SnackbarOptions> =
    (state) => state.pv.app.snackbar