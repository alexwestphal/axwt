
import * as React from 'react'

import {DndProvider as ReactDndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export const DndProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) =>
    <ReactDndProvider backend={HTML5Backend}>
        {children}
    </ReactDndProvider>

export default DndProvider