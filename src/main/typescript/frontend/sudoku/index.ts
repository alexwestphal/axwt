
import {Module, createModuleLauncher} from '@axwt/core'

import SudokuApp from './components/SudokuApp'
import * as SU from './store'


export const SudokuModule: Module<SU.State, SU.ExtraArgs, SU.AnyAction> = {
    moduleCode: 'SU',
    displayName: 'suoku',

    reducer: SU.Reducer,

    extraArgs: {},

    render: SudokuApp,

    initAction: SU.init
}

export default createModuleLauncher(SudokuModule)