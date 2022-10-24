
import * as React from 'react'

import {ControlBar, ResizeablePanelLayout, StandardMenuActions} from '@axwt/core'

import {
    FileSystemActions,
    selectAppMode,
    selectFSState,
    selectPlayAssistant,
    useThunkDispatch,
    useTypedSelector
} from '../store'

import AssistantPanel from './AssistantPanel'
import LeftPanel from './LeftPanel'
import MainPanel from './MainPanel'
import SolvePanel from './SolvePanel'

export const SudokuApp: React.FC = () => {

    const appMode = useTypedSelector(selectAppMode)
    const fsState = useTypedSelector(selectFSState)
    const assistant = useTypedSelector(selectPlayAssistant)

    const dispatch = useThunkDispatch()

    const handleMenuAction = (actionId: string) => {
        switch(actionId) {
            case 'folderOpen':
                dispatch(FileSystemActions.openFS())
                break
        }
    }

    return <>
        <ControlBar
            menus={[
                {
                    label: 'File',
                    id: 'fileMenu',
                    menuItems: [
                        {
                            actionId: 'new',
                            label: 'New'
                        },
                        StandardMenuActions.FileOpen,
                        StandardMenuActions.FolderOpen,
                        StandardMenuActions.FileSave,
                        StandardMenuActions.FileSaveAs
                    ]
                },
                {
                    label: 'Edit',
                    id: 'editMenu',
                    menuItems: [
                        StandardMenuActions.ActionUndo,
                        { ...StandardMenuActions.ActionRedo, divider: true },
                    ]
                }
            ]}
            onMenuAction={handleMenuAction}
        />
        <ResizeablePanelLayout
            leftPanel={ fsState.status != 'Closed' && {
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