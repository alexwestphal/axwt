
export type CommunicationStatus = 'Ready' | 'InProgress' | 'Done' | 'Error'

export interface CommunicationState {
    saveStatus: CommunicationStatus

    requests: { [requestKey: string]: CommunicationStatus }

    lastKeepAliveTime: number
    keepAliveCount: number
}

export namespace CommunicationState {
    export const Default: CommunicationState = {
        saveStatus: 'Ready',
        requests: {},

        lastKeepAliveTime: 0,
        keepAliveCount: 0
    }
}