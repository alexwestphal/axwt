

import {UUID} from './data'

type RequestId = UUID

interface RequestDetails {
    requestId: RequestId
    requestKey: string
    requestUrl: string
    requestInit: RequestInit
    listener?: RequestListener

    resolve: (response: Response) => void
    reject: (reason: any) => void

    status: RequestStatus
    tries: number
}


export type ConnectionStatus = 'ONLINE' | 'TRYING' | 'OFFLINE'
export type ConnectionStatusEventType = 'CONNECTION_LOST' | 'RECONNECTING' | 'RECONNECT_FAILED' | 'RECONNECTED'
export interface ConnectionStatusEvent {
    type: ConnectionStatusEventType
    status: ConnectionStatus
    nextAttemptTime?: number
}
export type ConnectionStatusListener = (event: ConnectionStatusEvent) => void

export interface MakeRequestOptions {
    listener?: RequestListener,
    cancelDuplicates?: boolean
}

export type RequestEventType = 'START' | 'HOLD' | 'RETRY' | 'CANCEL' | 'FINISH'
export interface RequestEvent {
    type: RequestEventType
}
export type RequestListener = (event: RequestEvent) => void
export type RequestStatus = 'READY' | 'TRYING' | 'HOLD' | 'DONE'




export const ServerConnection = new class {

    constructor() {
        // Set the interval handler to run every second
        setInterval(() => { this.intervalHandler() }, 1_000)

        // Listening to these events is not 100% reliable but provides a good indication of when to check things
        window.addEventListener('offline', () => this.setConnectionStatus('OFFLINE'))
        window.addEventListener('online', () => {
            // Have the interval handler try a ping on the next pass
            this.nextPingTime = Date.now()

        })
    }

    private requests: { [requestId: string]: RequestDetails } = {}

    private connectionStatus: ConnectionStatus = 'ONLINE'
    private connectionStatusListeners: ConnectionStatusListener[] = []

    private pingAttempts: number
    private nextPingTime: number
    private pingInProgress: boolean = false



    makeRequest(requestKey: string, requestUrl: string, requestInit: RequestInit, options: MakeRequestOptions): Promise<Response> {
        return new Promise((resolve, reject) => {

            let requestId = UUID.create()
            this.requests[requestId] = {
                requestId, requestKey, requestUrl, requestInit, resolve, reject,
                listener: options.listener, status: 'READY', tries: 0
            }

            if(options.cancelDuplicates) {
                for(let rId in this.requests) {
                    let existingRequest = this.requests[rId]
                    if(existingRequest.requestKey == requestKey && existingRequest.status == 'HOLD') {
                        if(options.listener) options.listener({ type: 'CANCEL' })
                    }
                }
            }

            if(this.connectionStatus == 'ONLINE') this.attemptRequest(requestId)
            else this.requests[requestId].status = 'HOLD'
        })
    }


    private attemptRequest(requestId: RequestId) {
        let request = this.requests[requestId]

        let requestEventType: RequestEventType = request.tries == 0 ? 'START' : 'RETRY'
        if(request.listener) request.listener({ type: requestEventType })

        request.status = 'TRYING'
        request.tries += 1

        fetch(request.requestUrl, request.requestInit)
            .then(
                response => {
                    request.status = 'DONE'
                    if(request.listener) request.listener({ type: 'FINISH' })
                    delete this.requests[requestId]
                    request.resolve(response)
                },
                error => {
                    if(error instanceof TypeError) {
                        // Connection Error
                        request.status = 'HOLD'
                        if(request.listener) request.listener({ type: 'HOLD' })
                        this.setConnectionStatus('OFFLINE')
                    } else {
                        // Unknown error
                        request.reject(error)
                    }
                }
            )

    }

    private setConnectionStatus(newStatus: ConnectionStatus) {
        if(newStatus != this.connectionStatus) {
            let previousStatus = this.connectionStatus
            this.connectionStatus = newStatus

            let eventType: ConnectionStatusEventType
            if(newStatus == 'ONLINE') {
                eventType = 'RECONNECTED'
                console.debug("[OPCE] Connection Restored")


            } else if(newStatus == 'OFFLINE') {
                if(previousStatus == 'ONLINE') {
                    eventType = 'CONNECTION_LOST'
                    console.log("[OPCE] Connection Lost")

                    this.pingAttempts = 0
                    this.nextPingTime = Date.now() + 1_000
                } else if(previousStatus == 'TRYING') {
                    eventType = 'RECONNECT_FAILED'
                    console.debug("[OPCE] Reconnect Failed")
                }
            } else if(newStatus == 'TRYING') {
                eventType = 'RECONNECTING'
                console.debug("[OPCE] Trying to Connect ...")
            }

            for(let listener of this.connectionStatusListeners) {
                listener({ type: eventType, status: newStatus, nextAttemptTime: this.nextPingTime })
            }
        }
    }

    /**
     * Function run every second to ping the server and retry requests (as required)
     */
    private intervalHandler() {
        if(this.connectionStatus == 'OFFLINE' && !this.pingInProgress) {
            let currentTime = Date.now()
            if(currentTime > this.nextPingTime) {
                this.pingAttempts += 1
                this.nextPingTime = currentTime + Math.min(Math.pow(2, this.pingAttempts), 60) * 1000

                this.setConnectionStatus('TRYING')
                this.pingInProgress = true
                fetch("/opce/app/ping")
                    .then(
                        response => {
                            // Connection is back
                            this.setConnectionStatus('ONLINE')
                            this.pingInProgress = false
                            for(let requestId in this.requests) {
                                // Retry all on-hold requests
                                if(this.requests[requestId].status == 'HOLD') {
                                    this.attemptRequest(requestId)
                                }
                            }
                        },
                        error => {
                            // Connection still down
                            this.setConnectionStatus('OFFLINE')
                            this.pingInProgress = false
                        }
                    )
            }
        }
    }

    addConnectionStatusListener(listener: ConnectionStatusListener) {
        this.connectionStatusListeners.push(listener)
    }

    removeConnectionStatusListener(listener: ConnectionStatusListener) {
        for(let i=0; i<this.connectionStatusListeners.length; i++) {
            if(this.connectionStatusListeners[i] == listener) {
                this.connectionStatusListeners.splice(i, 1)
            }
        }
    }
}