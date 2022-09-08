/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import CircleIcon from '@mui/icons-material/CircleOutlined'
import RectangleIcon from '@mui/icons-material/RectangleOutlined'
import ShapesIcon from '@mui/icons-material/Interests'

import {CommunicationActions, ControlBar, Core, SaveButton, StandardMenuActions} from '@axwt/core'
import ResizeablePanelLayout from '@axwt/core/components/ResizeablePanelLayout'

import {AppActions, useThunkDispatch, useTypedSelector} from '../store'

import LeftPanel from './LeftPanel'
import PVSnackbar from './PVSnackbar'
import RightPanel from './RightPanel'
import SVGDisplayPanel from './display/SVGDisplayPanel'



const PathVisualizer: React.FC = () => {

    const saveStatus = useTypedSelector(Core.selectSaveStatus)

    const dispatch = useThunkDispatch()

    const handleMenuAction = (actionId: string) => {

    }

    const handleSave = () => {
        dispatch(CommunicationActions.saveStart())
        dispatch(AppActions.save())

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
                            actionId: 'new',
                            label: 'New',
                        },
                        StandardMenuActions.FileOpen,
                        {
                            actionId: 'import',
                            label: 'Import',
                            submenuItems: [],
                            divider: true,
                        },
                        StandardMenuActions.FileSave,
                        StandardMenuActions.FileSaveAs,
                    ]
                },
                {
                    label: 'Edit',
                    id: "editMenu",
                    menuItems: [
                        StandardMenuActions.ActionUndo,
                        { ...StandardMenuActions.ActionRedo, divider: true },
                        StandardMenuActions.ContentCut,
                        StandardMenuActions.ContentCopy,
                        StandardMenuActions.ContentPaste,
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
                            actionId: 'insertPath',
                            label: 'Path',
                        },
                        {
                            label: 'Shape',
                            actionId: "insertShapeSubmenu",
                            icon: ShapesIcon,
                            submenuItems: [
                                {
                                    actionId: 'insertCircle',
                                    label: 'Circle',
                                    icon: CircleIcon,
                                },
                                {
                                    actionId: 'insertEllipse',
                                    label: 'Ellipse',
                                },
                                {
                                    actionId: 'insertPolygon',
                                    label: 'Polygon',
                                },
                                {
                                    actionId: 'insertRectangle',
                                    label: 'Rectangle',
                                    icon: RectangleIcon,
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

            onMenuAction={handleMenuAction}

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
        <PVSnackbar/>
    </>

}

export default PathVisualizer




