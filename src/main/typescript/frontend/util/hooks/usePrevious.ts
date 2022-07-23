/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import {useEffect, useRef} from 'react'

export const usePrevious = <T>(value: T): T => {
    const ref = useRef<T>()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

export default usePrevious