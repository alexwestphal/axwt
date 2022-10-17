
import * as React from 'react'

import {ResizeablePanelLayout} from '@axwt/core'

import {selectAppMode, selectPlayAssistant, useTypedSelector} from '../store'

import AssistantPanel from './AssistantPanel'
import LeftPanel from './LeftPanel'
import MainPanel from './MainPanel'
import SolvePanel from './SolvePanel'

export const SudokuApp: React.FC = () => {

    const appMode = useTypedSelector(selectAppMode)
    const assistant = useTypedSelector(selectPlayAssistant)

    return <>
        <ResizeablePanelLayout
            leftPanel={{
                Component: LeftPanel
            }}
            mainPanel={{
                Component: MainPanel
            }}
            rightPanel={
                appMode == 'Solve' && { Component: SolvePanel } ||
                appMode == 'Play' && assistant == 'On'&& { Component: AssistantPanel }
            }
        />
    </>
}

export default SudokuApp