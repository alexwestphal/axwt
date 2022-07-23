/*
 * Copyright (c) 2022, Alex Westphal.
 */

import {Action, createAction} from '@axwt/core'

import * as PV from '../PV'


export namespace AppActions {

    export type LoadState = Action<'pv/app/loadState', PV.State>

    export type Save = Action<'pv/app/save'>

    export type Any = LoadState | Save


    export const loadState = (state: PV.State): LoadState =>
        createAction('pv/app/loadState', state)

    export const save = (): Save =>
        createAction('pv/app/save')
}