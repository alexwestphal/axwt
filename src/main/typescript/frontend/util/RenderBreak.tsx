/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'

export interface RenderBreakProps {
    breakKey: string | number
}

/**
 * A component that provides a render break. That is everytime the breakKey changes, the children are not rendered, then
 * immediately rendered.
 */
export const RenderBreak: React.FC<React.PropsWithChildren<RenderBreakProps>> = ({breakKey, children}) => {

    const [previous, setPrevious] = React.useState<string | number>()
    React.useEffect(() => {
        setPrevious(breakKey)

    },[breakKey])

    return <>{previous == breakKey ? children : null}</>
}

export default RenderBreak