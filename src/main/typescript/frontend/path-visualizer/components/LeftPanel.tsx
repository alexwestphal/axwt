/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {SidePanelController} from '@axwt/core'

import ElementListPanel from './ElementListPanel'
import LibraryPanel from './LibraryPanel'


export const LeftPanel: React.FC = () => {

    return <SidePanelController
        side="Left"
        panels={[
            { title: "Elements", value: "elements", Component: ElementListPanel },
            { title: "Library", value: "library", Component: LibraryPanel }
        ]}
    >
    </SidePanelController>
}

export default LeftPanel