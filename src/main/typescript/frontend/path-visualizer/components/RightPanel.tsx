/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import SidePanelController from './SidePanelController'
import PresentationAttributesPanel from './attributes/PresentationAttributesPanel'
import ElementPanel from './attributes/ElementPanel'


export const RightPanel: React.FC = () => {

    return <SidePanelController
        side="Right"
        panels={[
            { title: "Element", value: "element", Component: ElementPanel },
            { title: "Presentation", value: 'presentation', Component: PresentationAttributesPanel }
        ]}
    >
    </SidePanelController>
}

export default RightPanel