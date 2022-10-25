
import * as React from 'react'

import {PanelSizingProps, SidePanelController} from '@axwt/core'

import FileSystemPanel, {FileSystemPanelControls} from './FileSystemPanel'

export const FilesPanel: React.FC<PanelSizingProps> = ({collapsePanel}) => {
    return <SidePanelController
        side="Left"
        collapsePanel={collapsePanel}
        panels={[
            {
                title: "All Files", value: "all",
                Component: FileSystemPanel,
                Controls: FileSystemPanelControls
            }
        ]}
    />
}

export default FilesPanel