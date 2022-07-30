/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

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
        <ControlBar navControls={
            <SaveButton title="Save"
                saveStatus={saveStatus}
                onClick={handleSave}
            >{{
                Ready: "Save",
                InProgress: "Saving",
                Done: "Saved",
                Error: "Save"
            }}</SaveButton>
        }/>
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




