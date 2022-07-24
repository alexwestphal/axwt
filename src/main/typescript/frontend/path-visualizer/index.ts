/*
 * Copyright (c) 2022, Alex Westphal.
 */


import PathVisualizer from './components/PathVisualizer'
import * as PV from './store'

import {Module, createModuleLauncher} from '@axwt/core'

export const PVModule: Module = {

    moduleCode: 'PV',
    displayName: 'path-visualizer',

    reducer: PV.Reducer,

    extraArgs: {},

    render: PathVisualizer,

    initAction: PV.init
}

export default createModuleLauncher(PVModule)
