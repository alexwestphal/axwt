
import * as React from 'react'

import {FSWorkspacePanel, FSWorkspacePanelControls, PanelSizingProps, SidePanelController} from '@axwt/core'

import * as SU from '../store'

export const FilesPanel: React.FC<PanelSizingProps> = ({collapsePanel}) => {
    return <SidePanelController
        side="Left"
        collapsePanel={collapsePanel}
        panels={[
            {
                title: "All Files", value: "all",
                Component: () => <FSWorkspacePanel
                    workspaceId={SU.FSWorkspaceId}
                    contextMenu={{
                        newPrimary: [
                            { label: "Sudoku Board" },
                        ]
                    }}
                />,
                Controls: () => <FSWorkspacePanelControls workspaceId={SU.FSWorkspaceId}/>
            }
        ]}
    />
}

export default FilesPanel

