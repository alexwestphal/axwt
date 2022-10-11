
import * as React from 'react'

import {SidePanelController} from '@axwt/core'

import RepositoryPanel from './RepositoryPanel'

export const LeftPanel: React.FC = () => {
    return <SidePanelController side="Left" panels={[
        { title: "Repository", value: "repository", Component: RepositoryPanel }
    ]}/>
}

export default LeftPanel