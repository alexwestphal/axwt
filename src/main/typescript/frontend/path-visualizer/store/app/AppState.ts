/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {UUID} from '@axwt/core'

import {SnackbarOptions} from '@axwt/path-visualizer/data'


export interface AppState {
    saveFileHandleId: UUID | null
    snackbar: SnackbarOptions
}

export namespace AppState {
    export const Default: AppState = {
        saveFileHandleId: null,
        snackbar: null
    }
}
