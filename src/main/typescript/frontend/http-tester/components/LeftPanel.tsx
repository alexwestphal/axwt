
import * as React from 'react'

import {SidePanelController} from '@axwt/core'

import HistoryPanel from './HistoryPanel'
import RepositoryPanel from './RepositoryPanel'

export const LeftPanel: React.FC = () => {

    return <SidePanelController side="Left" panels={[
        { title: "History", value: "history", Component: HistoryPanel },
        { title: "Repository", value: "repository", Component: RepositoryPanel }
    ]}/>
}

export default LeftPanel