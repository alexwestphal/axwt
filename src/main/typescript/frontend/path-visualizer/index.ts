/*
 * Copyright (c) 2022, Alex Westphal.
 */


import PathVisualizer from './components/PathVisualizer'
import * as PV from './store'

import {Module, createModuleLauncher, StandardShortcuts} from '@axwt/core'

export const PVModule: Module = {

    moduleCode: 'PV',
    displayName: 'path-visualizer',

    reducer: PV.Reducer,

    extraArgs: {},

    render: PathVisualizer,

    initAction: PV.init,

    keyboardShortcuts: [
        StandardShortcuts.ActionRedo, StandardShortcuts.ActionUndo,
        StandardShortcuts.ContentCopy, StandardShortcuts.ContentCut, StandardShortcuts.ContentPaste,
        StandardShortcuts.FileOpen, StandardShortcuts.FileSave, StandardShortcuts.FileSaveAs
    ],

    onKeyboardShortcut: PV.handleKeyboardShortcut
}

export default createModuleLauncher(PVModule)
