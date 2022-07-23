/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import * as React from 'react'

export const useScrollY = (): number => {
    const [scrollY, setScrollY] = React.useState<number>(0)

    React.useEffect(() => {
        function handleScroll() {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return scrollY
}

export default useScrollY