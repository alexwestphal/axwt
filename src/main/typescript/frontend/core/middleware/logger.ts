
import { Middleware } from 'redux'

import {Action} from '../store'

const logger: Middleware = store => next => (action: Action<any>) => {

    if(action.type) {
        if(action.hideDetails) {
            let message = `[AXWT] ${action.type}`
            if(typeof action.payload === 'string') {
                message += ": "
                if(action.payload.length > 32) message += action.payload.substring(0, 32) + "..."
                else message += action.payload
            }
            console.debug(message)
            return next(action)
        } else {
            console.group(`[AXWT] ${action.type}`)
            console.debug('dispatching', action)
            let result = next(action)
            console.debug('next state', store.getState())
            console.groupEnd()
            return result
        }
    } else return next(action)
}

  export default logger