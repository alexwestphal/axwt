
import * as React from 'react'

import { Alert, AlertTitle, Snackbar } from '@mui/material'

import {Core, ErrorActions, I18n} from '@axwt/core'
import {useCurrentTime} from '@axwt/util'

import {
    ConnectionStatusEvent,
    ConnectionStatusListener,
    ServerConnection
} from '../ServerConnection'



export const ErrorSnackbar: React.FC = () => {
    const phrases = I18n.usePhrases()

    const latestError = Core.useTypedSelector(Core.selectLatestError)
    const showError = Core.useTypedSelector(Core.selectShowError)

    const [lastConnectionEvent, setLastConnectionEvent] = React.useState<ConnectionStatusEvent>(null)
    React.useEffect(() => {
        const listener: ConnectionStatusListener = (event) => {
            setLastConnectionEvent(event)
            if(event.type == 'RECONNECTED') setTimeout(() => {
                // Clear after 2s
                setLastConnectionEvent(null)
            }, 3_000)
        }
        ServerConnection.addConnectionStatusListener(listener)

        return () => ServerConnection.removeConnectionStatusListener(listener)
    }, [])

    const currentTime = useCurrentTime(1_000)

    const dispatch = Core.useThunkDispatch()

    const handleClose = () => {
        dispatch(ErrorActions.clearError())
    }

    let nextAttemptIn = lastConnectionEvent ? Math.round((lastConnectionEvent.nextAttemptTime - currentTime) / 1_000) : 0

    let connectionMessage: string = ""
    switch(lastConnectionEvent?.type) {
        case 'CONNECTION_LOST':
            connectionMessage = phrases.g_connection_lost
            break
        case 'RECONNECT_FAILED':
            if(nextAttemptIn < 2) connectionMessage = phrases.g_connection_reconnecting
            else connectionMessage = phrases.g_connection_waiting.interpolate(nextAttemptIn)
            break
        case 'RECONNECTING':
            connectionMessage = phrases.g_connection_reconnecting
            break
        case 'RECONNECTED':
            connectionMessage = phrases.g_connection_reconnected
            break
    }

    return <>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            open={!!lastConnectionEvent}
        >
            <Alert severity={lastConnectionEvent?.type != 'RECONNECTED' ? 'warning' : 'success'}>{connectionMessage}</Alert>
        </Snackbar>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            open={showError}
            //onClose={handleClose}
        >
            <Alert onClose={handleClose} severity="error">
                <AlertTitle>{latestError?.anomalyType}</AlertTitle>
                {latestError?.message}
            </Alert>
        </Snackbar>
    </>
}

export default ErrorSnackbar