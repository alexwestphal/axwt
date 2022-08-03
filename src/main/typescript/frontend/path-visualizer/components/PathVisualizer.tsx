/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import CircleIcon from '@mui/icons-material/CircleOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import ExportIcon from '@mui/icons-material/ImportExport'
import OpenIcon from '@mui/icons-material/FolderOpen'
import RedoIcon from '@mui/icons-material/Redo'
import RectangleIcon from '@mui/icons-material/RectangleOutlined'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import ShapesIcon from '@mui/icons-material/Interests'
import UndoIcon from '@mui/icons-material/Undo'

import {CommunicationActions, ControlBar, Core, SaveButton} from '@axwt/core'
import ResizeablePanelLayout from '@axwt/core/components/ResizeablePanelLayout'

import {saveToLocalStorage, useThunkDispatch, useTypedSelector} from '../store'


import LeftPanel from './LeftPanel'

import RightPanel from './RightPanel'
import SVGDisplayPanel from './display/SVGDisplayPanel'


const PathVisualizer: React.FC = () => {

    const saveStatus = useTypedSelector(Core.selectSaveStatus)

    const dispatch = useThunkDispatch()

    const handleSave = () => {
        dispatch(CommunicationActions.saveStart())
        dispatch(saveToLocalStorage())

        setTimeout(() => {
            dispatch(CommunicationActions.saveEnd())
        }, 500)
    }

    return <>
        <ControlBar
            menus={[
                {
                    label: 'File',
                    id: "fileMenu",
                    menuItems: [
                        {
                            label: 'New',
                            onClick: () => {}
                        },
                        {
                            label: 'Open',
                            icon: OpenIcon,
                            keyboardShortcut: "⌘O",
                            onClick: () => {}
                        },
                        {
                            label: 'Import',
                            onClick: () => {},
                            submenuItems: [],
                            divider: true,
                        },
                        {
                            label: 'Save As',
                            icon: SaveAsIcon,
                            onClick: () => {}
                        },
                        {
                            label: 'Export',
                            icon: ExportIcon,
                            onClick: () => {}
                        },
                    ]
                },
                {
                    label: 'Edit',
                    id: "editMenu",
                    menuItems: [
                        {
                            label: 'Undo',
                            icon: UndoIcon,
                            keyboardShortcut: "⌘Z",
                            onClick: () => {}
                        },
                        {
                            label: 'Redo',
                            icon: RedoIcon,
                            keyboardShortcut: "⌘Y",
                            onClick: () => {},
                            divider: true
                        },
                        {
                            label: 'Cut',
                            icon: ContentCutIcon,
                            keyboardShortcut: "⌘X",
                            onClick: () => {}
                        },
                        {
                            label: 'Copy',
                            icon: ContentCopyIcon,
                            keyboardShortcut: "⌘C",
                            onClick: () => {}
                        },
                        {
                            label: 'Paste',
                            icon: ContentPasteIcon,
                            keyboardShortcut: "⌘P",
                            onClick: () => {}
                        },
                    ]
                },
                {
                    label: 'View',
                    id: "viewMenu",
                    menuItems: []
                },
                {
                    label: 'Insert',
                    id: "insertMenu",
                    menuItems: [
                        {
                            label: 'Path',
                            onClick: () => {}
                        },
                        {
                            label: 'Shape',
                            id: "insertShapeSubmenu",
                            icon: ShapesIcon,
                            onClick: () => {},
                            submenuItems: [
                                {
                                    label: 'Circle',
                                    icon: CircleIcon,
                                    onClick: () => {},
                                },
                                {
                                    label: 'Ellipse',
                                    onClick: () => {},
                                },
                                {
                                    label: 'Polygon',
                                    onClick: () => {},
                                },
                                {
                                    label: 'Rectangle',
                                    icon: RectangleIcon,
                                    onClick: () => {}
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Panels',
                    id: 'panelsMenu',
                    menuItems: []
                },
            ]}
            navControls={
                <SaveButton title="Save"
                    saveStatus={saveStatus}
                    onClick={handleSave}
                >{{
                    Ready: "Save",
                    InProgress: "Saving",
                    Done: "Saved",
                    Error: "Save"
                }}</SaveButton>
            }
        />
        <ResizeablePanelLayout
            leftPanel={{
                Component: LeftPanel,
            }}
            rightPanel={{
                Component: RightPanel,
                width: 1/3
            }}
            // bottomPanel={{
            //     Component: React.Fragment
            // }}
            mainPanel={{
                Component: SVGDisplayPanel
            }}
        />
    </>

}

export default PathVisualizer




