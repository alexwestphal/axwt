
import * as React from 'react'

import {ResizeablePanelLayout} from '@axwt/core'

import {selectAppMode, useTypedSelector} from '../store'

import LeftPanel from './LeftPanel'
import MainPanel from './MainPanel'
import SolvePanel from './SolvePanel'


export const SudokuApp: React.FC = () => {

    const appMode = useTypedSelector(selectAppMode)

    return <>
        <ResizeablePanelLayout
            leftPanel={{
                Component: LeftPanel
            }}
            mainPanel={{
                Component: MainPanel
            }}
            rightPanel={appMode == 'Solve' && {
                Component: SolvePanel
            }}
        />
    </>
}

export default SudokuApp