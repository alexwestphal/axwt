
import * as React from 'react'

import {SidePanelController} from '@axwt/core'

import FileSystemPanel, {FileSystemPanelControls} from './FileSystemPanel'

export const LeftPanel: React.FC = () => {
    return <SidePanelController side="Left" panels={[
        {
            title: "Repository", value: "repository",
            Component: FileSystemPanel,
            Controls: FileSystemPanelControls
        }
    ]}/>
}

export default LeftPanel