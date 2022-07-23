/*
 * Copyright (c) 2022, Alex Westphal.
 */

import produce, {Draft} from 'immer'
import {Reducer} from 'redux'
import {Selector} from 'reselect'

import {Action, createAction} from '@axwt/core'

import {GridLineConfig, ViewBox} from '../../data'

import * as PV from '../PV'


export namespace ConfigActions {

    export type SetViewBox = Action<'pv/config/setViewBox', [number, number, number, number]>

    export type Any = SetViewBox


    export const setViewBox = (viewBox: [number, number, number, number]): SetViewBox =>
        createAction('pv/config/setViewBox', viewBox)

}

export interface ConfigState {
    viewBox: ViewBox

    gridLines: GridLineConfig
}

export namespace ConfigState {
    export const Default: ConfigState = {
        viewBox: { minX: 0, minY: 0, width: 24, height: 24 },

        gridLines: GridLineConfig.Default
    }
}

export const ConfigReducer: Reducer<ConfigState> = produce((draft: Draft<ConfigState>, action: PV.AnyAction) => {
    switch(action.type) {
        case 'pv/app/loadState':
            return action.payload.config

    }
}, ConfigState.Default)


export const selectViewBox: Selector<PV.RootState, ViewBox> =
    (state) => state.pv.config.viewBox

export const selectGridLines: Selector<PV.RootState, GridLineConfig> =
    (state) => state.pv.config.gridLines