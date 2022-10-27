
import * as React from 'react'

import {ControlBar, ResizeablePanelLayout, StandardMenuActions} from '@axwt/core'

import * as Core from '@axwt/core/store'

import {FSWorkspaceId, selectBoardMode, useThunkDispatch, useTypedSelector} from '../store'

import AssistantPanel from './AssistantPanel'
import FilesPanel from './FilesPanel'
import MainPanel from './MainPanel'
import SolvePanel from './SolvePanel'

export const SudokuApp: React.FC = () => {

    const boardMode = useTypedSelector(selectBoardMode)
    const workspace = useTypedSelector(state => Core.selectFSWorkspace(state, FSWorkspaceId))

    const dispatch = useThunkDispatch()

    const handleMenuAction = (actionId: string) => {
        switch(actionId) {
            case 'folderOpen':
                dispatch(Core.FSActions.openWorkspace(FSWorkspaceId))
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
            leftSide={{
                panels: [
                    {
                        Component: FilesPanel,
                        label: "Files",
                        available: workspace.status != 'Closed',
                        autoOpen: true,
                    },
                ]

            }}
            main={{
                Component: MainPanel
            }}
            rightSide={{
                panels: [
                    {
                        Component: AssistantPanel,
                        label: 'Assistant',
                        available: boardMode == 'Play',
                    },
                    {
                        Component: SolvePanel,
                        label: 'Solve',
                        available: boardMode == 'Solve',
                        autoOpen: true
                    }
                ]
            }}
        />
    </>
}

export default SudokuApp