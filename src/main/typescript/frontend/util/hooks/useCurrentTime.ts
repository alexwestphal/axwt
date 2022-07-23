/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'


export function useCurrentTime(updateInterval: number): number {
    const [currentTime, setCurrentTime] = React.useState<number>(Date.now())
    React.useEffect(() => {
        const handler = () => {
            setCurrentTime(Date.now())
        }
        let intervalId = setInterval(handler, updateInterval)

        return () => clearInterval(intervalId)
    }, [updateInterval])

    return currentTime
}