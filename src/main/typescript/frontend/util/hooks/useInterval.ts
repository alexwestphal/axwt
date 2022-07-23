/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

import { useEffect, useRef } from 'react'

type Callback = () => void

export function useInterval(callback: Callback, delay: number) {
  const savedCallback = useRef<Callback>(null)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default useInterval