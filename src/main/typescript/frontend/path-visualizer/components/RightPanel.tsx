/*
 * Copyright (c) 2022, Alex Westphal.
 */

import * as React from 'react'

import {selectCurrentElement, useTypedSelector} from '../store'


import SidePanelController from './SidePanelController'
import PathSegmentsPanel from './PathSegmentsPanel'
import PresentationAttributesPanel from './PresentationAttributesPanel'
import ElementPanel from './ElementPanel'


export const RightPanel: React.FC = () => {

    const currentElement = useTypedSelector(selectCurrentElement)

    return <SidePanelController
        side="Right"
        panels={[
            currentElement?.elementType == 'path' && { title: "Path Segments", value: 'pathSegments', Component: PathSegmentsPanel },
            currentElement && { title: "Element", value: "element", Component: ElementPanel },
            currentElement && { title: "Presentation", value: 'presentation', Component: PresentationAttributesPanel }
        ]}
    >
    </SidePanelController>
}

export default RightPanel