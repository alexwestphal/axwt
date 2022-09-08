/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Action, createAction} from '@axwt/core'

import {SnackbarOptions} from '@axwt/path-visualizer/data'

import * as PV from '../PV'
import {selectSaveFileHandleId} from './AppSelectors'



export namespace AppActions {

    export type LoadState = Action<'pv/app/loadState', PV.State>

    export type Save = Action<'pv/app/save'>

    export type SaveAs = Action<'pv/app/saveAs'>

    export type SnackbarSet = Action<'pv/app/snackbarSet', SnackbarOptions>
    export type SnackbarUnset = Action<'pv/app/snackbarUnset'>

    export type Any = LoadState | Save | SaveAs | SnackbarSet | SnackbarUnset

    export const loadFromLocalStorage = (): PV.ThunkAction<boolean> =>
        (dispatch) => {
            let stateStr = localStorage.getItem("OPCE-PV-SAVEDATA")
            if(null == stateStr) return false

            let state = JSON.parse(stateStr)
            dispatch(loadState(state))
            return true
        }

    export const loadState = (state: PV.State): LoadState =>
        createAction('pv/app/loadState', state)

    export const save = (): PV.ThunkAction<Promise<void>> =>
        async (dispatch, getState) => {
            //const handleId = selectSaveFileHandleId(getState())
            //if(null == handleId) return dispatch(saveAs())

            // File has been saved before
            dispatch(createAction('pv/app/save'))

            // const [fileHandle] = await window['showSaveFilePicker']({
            //     types: [
            //         {
            //             name: 'PathVisualizer Save Files',
            //             accept: {
            //                 'application/json': '.pv.json'
            //             }
            //         }
            //     ]
            // })

            dispatch(saveToLocalStorage())
            dispatch(snackbarSet({ message: "Saved to Local Storage" }))

        }


    export const saveAs = (): PV.ThunkAction<Promise<void>> =>
        (dispatch, getState) => {
            return Promise.resolve()
        }

    export const saveToLocalStorage = (): PV.ThunkAction =>
        (dispatch, getState) => {
            let state = getState().pv

            let stateStr = JSON.stringify(state)
            localStorage.setItem("OPCE-PV-SAVEDATA", stateStr)
        }


    export const snackbarSet = (options: SnackbarOptions): SnackbarSet =>
        createAction('pv/app/snackbarSet', options)

    export const snackbarUnset = (): SnackbarUnset =>
        createAction('pv/app/snackbarUnset')
}