/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'
import {useEffect} from 'react'

export interface WindowSize {
    readonly width: number
    readonly height: number
}

export function useWindowSize(): WindowSize {

    const [windowSize, setWindowSize] = React.useState<WindowSize>({ width: 1000, height: 1000 })

    useEffect(() => {

        function handleResize() {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }

        // Register event listener
        window.addEventListener("resize", handleResize)

        // Call handler so state gets updated with initial size
        handleResize()

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize)

    }, [])

    return windowSize
}

export default useWindowSize