
import * as React from 'react'

import {ResizeablePanelLayout} from '@axwt/core'

import HTMainPanel from './HTMainPanel'
import LeftPanel from './LeftPanel'



export const HttpTester: React.FC = () => {

    return <>
        <ResizeablePanelLayout
            leftPanel={{
                Component: LeftPanel
            }}
            mainPanel={{
                Component: HTMainPanel
            }}
        />
    </>
}

export default HttpTester