
import * as React from 'react'

import {ControlBar, ResizeablePanelLayout, StandardMenuActions} from '@axwt/core'

import * as Core from '@axwt/core/store'

import {FSWorkspaceId, selectAppMode, selectPlayAssistant, useThunkDispatch, useTypedSelector} from '../store'

import AssistantPanel from './AssistantPanel'
import FilesPanel from './FilesPanel'
import MainPanel from './MainPanel'
import SolvePanel from './SolvePanel'

export const SudokuApp: React.FC = () => {

    const appMode = useTypedSelector(selectAppMode)
    const workspace = useTypedSelector(state => Core.selectFSWorkspace(state, FSWorkspaceId))
    const assistant = useTypedSelector(selectPlayAssistant)

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
            leftSide={ workspace.status != 'Closed' && {
                panels: [
                    { Component: FilesPanel, label: "Files" },
                ]

            }}
            main={{
                Component: MainPanel
            }}
            rightSide={
                appMode == 'Solve' && {
                    panels: [
                        { Component: SolvePanel, label: 'Solve' }
                    ]
                } ||
                appMode == 'Play' && assistant == 'On'&& {
                    panels: [
                        { Component: AssistantPanel, label: 'Assistant' }
                    ]
                }
            }
        />
    </>
}

export default SudokuApp